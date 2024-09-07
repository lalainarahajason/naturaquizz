import Link from "next/link";
import { Plus } from "lucide-react";

function AddItem({
    href,
}: {
    href: string;
}) {
  return (
    <Link className="rounded-full bg-green-600 text-white text-xs p-1" href={href}><Plus /></Link>

  )
}

export default AddItem