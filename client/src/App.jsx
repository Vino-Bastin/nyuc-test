import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Layout from "./layout";
import Home from "./pages/home";
import NotFound from "./pages/404";
import UploadImage from "./features/uploadImage";
import UploadResume from "./features/uploadResume";
import GalleryView from "./features/uploadImage/galleryView";

import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Toaster />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/resume" element={<UploadResume />} />
            <Route path="/gallery" element={<UploadImage />} />
            <Route path="/gallery/:identifier" element={<GalleryView />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
