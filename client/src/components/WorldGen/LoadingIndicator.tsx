import { useEffect, useState } from "react";
import { useWorldGen } from "@/lib/stores/useWorldGen";

const LoadingIndicator = () => {
  const { isLoading, isGenerating } = useWorldGen();
  const [loadingText, setLoadingText] = useState("Processing your world");
  const [dots, setDots] = useState("");
  
  // Animate the loading dots
  useEffect(() => {
    if (!isLoading && !isGenerating) return;
    
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [isLoading, isGenerating]);
  
  // Change the loading message based on state
  useEffect(() => {
    if (isGenerating) {
      setLoadingText("Generating your world");
    } else if (isLoading) {
      setLoadingText("Processing your request");
    }
  }, [isLoading, isGenerating]);
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
      <div className="w-20 h-20 mb-4 flex items-center justify-center">
        <svg
          className="animate-spin w-16 h-16 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <div className="text-white text-xl font-medium">
        {loadingText}<span className="w-[30px] inline-block">{dots}</span>
      </div>
    </div>
  );
};

export default LoadingIndicator;
