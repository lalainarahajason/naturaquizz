import Link from "next/link";
import { Plus } from "lucide-react";

type AddComponentType = {
    message: string;
    label: string;
    link: string;
}

function NoList({message, label, link}: AddComponentType) {
  return (
    <>
      <div className="text-gray-600 text-3xl text-center mb-4 font-bold">{ message }</div>
      <p className="text-center flex justify-center ">
        <Link
          className="w-auto flex items-center gap-3 justify-center rounded-full bg-green-600 hover:bg-green-700 py-2 px-4 text-white"
          href={link}
        >
          <Plus />
          <span className="text-xs uppercase">{ label }</span>
        </Link>
      </p>
    </>
  );
}

export default NoList;
