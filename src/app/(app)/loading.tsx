"use client";

import { Loader2, Leaf } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full space-y-6 animate-in fade-in duration-500">
      {/* Glow effect container */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer glowing pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 dark:bg-emerald-400/5 animate-ping duration-1000" />
        
        {/* Spinner ring */}
        <Loader2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400 animate-spin absolute" style={{ animationDuration: "1.5s" }} />
        
        {/* Core leaf icon */}
        <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
          <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center space-y-2">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-wide uppercase">
          EcoSphere
        </h3>
        <p className="text-xs text-neutral-450 dark:text-neutral-400 animate-pulse font-medium">
          Compiling sustainability data & ESG metrics...
        </p>
      </div>
      
      {/* Decorative loading line */}
      <div className="w-36 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full animate-progress" style={{
          animation: "progress 2s infinite linear",
        }} />
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
