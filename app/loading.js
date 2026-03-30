import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">
            Loading...
        </p>
      </div>
    </div>
  );
}
