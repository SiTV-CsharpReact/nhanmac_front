export default function Loading() {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        {/* Spinner SVG với animation spin của Tailwind */}
        <svg
          className="w-12 h-12 text-blue-600 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
  
        {/* Text loading */}
        <p className="text-gray-500 text-lg font-medium">Đang tải dữ liệu...</p>
      </div>
    );
  }
  