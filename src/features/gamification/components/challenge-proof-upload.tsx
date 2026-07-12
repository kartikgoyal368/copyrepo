"use client";

import { useState } from "react";
import { FileUp, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProofUploadProps {
  onUploadComplete: (url: string) => void;
}

export default function ChallengeProofUpload({ onUploadComplete }: ProofUploadProps) {
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleSimulatedUpload = () => {
    setLoading(true);
    setTimeout(() => {
      const mockUrl = `https://utfs.io/f/mock_challenge_proof_${Math.random().toString(36).substring(7)}.png`;
      setUploadedUrl(mockUrl);
      onUploadComplete(mockUrl);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="border border-dashed border-neutral-350 dark:border-neutral-800 rounded-lg p-4 text-center bg-neutral-50 dark:bg-neutral-900/50">
      {uploadedUrl ? (
        <div className="space-y-2">
          <div className="inline-flex w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="block text-xs font-bold text-neutral-850 dark:text-neutral-250">
            Evidence Logged
          </span>
          <span className="block text-[10px] text-neutral-400 font-mono select-all truncate max-w-xs mx-auto">
            {uploadedUrl}
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <FileUp className="w-8 h-8 text-neutral-400 mx-auto" />
          <div>
            <span className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
              Drag & drop campaign evidence files
            </span>
            <span className="block text-[9px] text-neutral-450 mt-0.5">
              Secure uploads routed to UploadThing.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleSimulatedUpload}
            className="text-xs h-8 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Uploading assets...
              </>
            ) : (
              "Browse Local Files"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
