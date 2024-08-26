import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Generate a slug from a title
 */
export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

export function getPublicIdFromUrl(url:string) {

  // get publicId of cloudflare media url without the extension
  return url.split("/").pop()?.split(".")[0] as string;

}
