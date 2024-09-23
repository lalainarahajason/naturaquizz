import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center">
      <Loader2 className="h-14 w-14 animate-spin" />
    </div>
  )
}

export default Loading;