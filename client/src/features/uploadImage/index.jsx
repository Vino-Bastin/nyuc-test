import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";

import { storage } from "../../firebase";
import useIdentifierCheck from "./api/useEmailCheck";
import useCreateGallery from "./api/useCreateGallery";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";

const gallerySchema = z.object({
  identifier: z
    .string()
    .min(2, "Please enter an identifier")
    .regex(/^[A-Za-z]+$/, "Identifier should only contain alphabets"),
  width: z.string(),
  height: z.string(),
  images: z.array(
    z.object({
      file: z.instanceof(File),
      id: z.string(),
    })
  ),
});

const UploadImage = () => {
  const [files, setFiles] = useState([]);
  const form = useForm({
    resolver: zodResolver(gallerySchema),
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/png, image/jpeg image/jpg",
    onDrop: (acceptedFiles) => {
      const filteredFiles = [];
      for (const file of acceptedFiles) {
        if (file.size > 2 * 1024 * 1024) {
          form.setError("images", {
            message: "File size must be less than 2MB",
          });
          continue;
        }
        if (
          file.type !== "image/png" &&
          file.type !== "image/jpeg" &&
          file.type !== "image/jpg"
        ) {
          form.setError("images", {
            message: "File must be in PNG, JPEG or JPG format",
          });
          continue;
        }
        filteredFiles.push({ id: nanoid(10), file });
      }
      setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
      form.setValue("images", filteredFiles);
    },
  });
  const [progress, setProgress] = useState({});
  const identifierCheckMutation = useIdentifierCheck();
  const createGalleryMutation = useCreateGallery();

  let isLoading =
    identifierCheckMutation.isLoading ||
    createGalleryMutation.isPending ||
    Object.values(progress).some((p) => p < 100);

  const handleSubmit = async (data) => {
    const isIdentifierAvailable = await identifierCheckMutation.mutateAsync(
      data.identifier
    );
    if (!isIdentifierAvailable) {
      form.setError("identifier", {
        message: "Identifier is already in use",
      });
      return;
    }

    // * upload images
    const uploadPromises = files.map(({ file, id }) => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `gallery/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress((prev) => ({ ...prev, [id]: progress }));
          },
          (error) => {
            toast.error(`Error uploading image ${file.name}`);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    });

    try {
      const downloadURLs = await Promise.all(uploadPromises);
      await createGalleryMutation.mutateAsync({
        identifier: data.identifier,
        width: data.width,
        height: data.height,
        images: downloadURLs,
      });
      toast.success("Gallery created successfully");
      form.reset();
      setFiles([]);
      setProgress({});
    } catch (error) {
      toast.error("Error creating gallery");
    }
  };

  const removeFile = (id) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  return (
    <div className="bg-slate-50 rounded p-6 px-8 w-[100%] max-w-[500px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
        <Button size="sm" variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="width"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Width</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="height"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            name="images"
            control={form.control}
            render={({ fieldState }) => (
              <FormItem>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input
                    {...getInputProps()}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                  <div className="p-4 border-2 border-dashed border-gray-400 rounded-md text-center">
                    <p>
                      Drag &apos;n&apos; drop your images , or click to select
                    </p>
                  </div>
                </div>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {files.length > 0 && (
            <div className="flex gap-2">
              {files.map(({ file, id }) => (
                <div key={id} className="flex flex-col items-center space-y-2">
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <X
                      className="absolute top-[-5px] right-[-5px] bg-red-500 cursor-pointer text-white rounded-[50%] size-5 p-1"
                      onClick={() => removeFile(id)}
                    />
                  </div>
                  <Progress value={progress[id] || 0} />
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center">
            {isLoading ? (
              <Loader2 className="text-blue-700 animate-spin size-8" />
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UploadImage;
