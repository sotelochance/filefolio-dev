import { Loader2 } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="flex justify-center text-xl items-center h-screen">
      Loading<span className="animate-bounce delay-200">.</span>
      <span className="animate-bounce delay-400">.</span>
      <span className="animate-bounce delay-500">.</span>
    </div>
  );
}

export default Loading;
