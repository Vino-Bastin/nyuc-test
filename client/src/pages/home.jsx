import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-2 bg-slate-50 rounded p-6">
      <p className="text-lg font-semibold">Welcome to the Home page!</p>
      <div className="space-x-3">
        <Button size="sm">
          <Link to="/upload-image">Upload Image</Link>
        </Button>
        <Button size="sm">
          <Link to="/upload-resume">Upload Resume</Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
