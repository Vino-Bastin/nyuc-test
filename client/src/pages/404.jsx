import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NotFound = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-8 px-4 py-12 md:py-24">
      <FrownIcon className="h-32 w-32 text-gray-500 dark:text-gray-400" />
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          {message ? message : "Oops! Page not found."}
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry, you can go back to the homepage and try again.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

NotFound.propTypes = {
  message: PropTypes.string,
};

function FrownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

export default NotFound;
