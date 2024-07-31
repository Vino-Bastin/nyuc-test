import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Link } from "react-router-dom";

import { storage } from "../../firebase";
import useEmailCheck from "./api/useEmailCheck";
import useCreateAccount from "./api/useCreateAccount";

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

const uploadResumeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "Please enter your first name"),
  lastName: z.string("Please enter your last name"),
  resume: z.instanceof(File, "Please upload a resume"),
});

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const form = useForm({
    resolver: zodResolver(uploadResumeSchema),
  });
  const { getRootProps, getInputProps } = useDropzone({
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 2 * 1024 * 1024)
        return form.setError("resume", {
          message: "File size must be less than 2MB",
        });
      if (file.type !== "application/pdf")
        return form.setError("resume", {
          message: "File must be in PDF format",
        });
      setFile(acceptedFiles[0]);
      form.setValue("resume", acceptedFiles[0]);
    },
  });
  const [progress, setProgress] = useState(0);
  const emailCheckMutation = useEmailCheck();
  const createAccountMutation = useCreateAccount();

  let isLoading =
    emailCheckMutation.isPending ||
    progress !== 0 ||
    createAccountMutation.isPending;

  const handleSubmit = async (data) => {
    const isEmailAvailable = await emailCheckMutation.mutateAsync(data.email);
    if (!isEmailAvailable) return toast.error("Email already exists");
    const storageRef = ref(storage, `resumes/${nanoid(10)}`);
    const uploadTask = uploadBytesResumable(storageRef, data.resume);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => toast.error(error.message),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const accountData = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          resumeURL: downloadURL,
        };
        createAccountMutation.mutate(accountData, {
          onSuccess: () => {
            toast.success("Account created successfully");
            form.reset();
            setFile(null);
            setProgress(0);
          },
          onError: () => toast.error("Error creating account"),
        });
      }
    );
  };

  return (
    <div className="bg-slate-50 rounded p-6 px-8 w-[100%] max-w-[400px]">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Upload Resume</h1>
        <Button size="sm" variant="outline">
          <Link to="/">Home</Link>
        </Button>
      </div>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            name="resume"
            control={form.control}
            render={({ fieldState }) => (
              <FormItem>
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} accept="application/pdf" />
                  <div className="p-4 border-2 border-dashed border-gray-400 rounded-md text-center">
                    {file ? (
                      <p>{file.name}</p>
                    ) : (
                      <p>
                        Drag &apos;n&apos; drop your resume (PDF format), or
                        click to select one
                      </p>
                    )}
                  </div>
                </div>
                <FormMessage>{fieldState.error?.message}</FormMessage>
              </FormItem>
            )}
          />
          {progress > 0 && <Progress value={progress} />}
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

export default UploadResume;
