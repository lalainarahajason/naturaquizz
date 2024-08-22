"use server";

import { v2 as cloudinary } from "cloudinary";
import { error } from "console";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Delete image from cloudinary by it's id
 */
export const deleteImage = async (publicId: string | null) => {

  if (!publicId) throw new Error("Public id est obligatoire");

  try {

    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result === 'ok') {
      return {
        success: "Image supprimée avec succès",
        result,
      };
    }

    return { error: "Erreur de suppression du média", result };

  } catch (error) {
    return {
        error: (error as Error).message,
    }
  }
};
