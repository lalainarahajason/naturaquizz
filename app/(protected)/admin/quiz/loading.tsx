import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="h-full bg-white/60 flex justify-center items-center">
      <Loader2 className="h-14 w-14 animate-spin" />
    </div>
  )
}

export default Loading;