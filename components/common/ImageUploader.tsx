"use client";

import { useState } from "react";
import { uploadImage } from "@/services/uploadService";

interface Props {
  image: string;
  setImage: (url: string) => void;

  imagePublicId: string;
  setImagePublicId: (id: string) => void;
}

export default function ImageUploader({
  image,
  setImage,
  imagePublicId,
  setImagePublicId,
}: Props) {

  const [uploading, setUploading] =
    useState(false);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (!file) return;

    try {

      setUploading(true);

      const data = await uploadImage(file);

      setImage(data.imageUrl);
setImagePublicId(data.publicId);

    } catch (error) {

      console.log(error);

      alert("Image upload failed");

    } finally {

      setUploading(false);

    }

  };

  return (

    <div className="space-y-4">

      <label className="block font-medium">
        Product Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="w-full border border-slate-200 rounded-lg p-3"
      />

      {uploading && (
        <p className="text-blue-600">
          Uploading...
        </p>
      )}

      {image && (
        <div className="space-y-2">

          <img
            src={image}
            alt="Product"
            className="w-40 h-40 object-cover rounded-lg border border-slate-200"
          />

          <p className="text-xs text-gray-500 break-all">
            {imagePublicId}
          </p>

        </div>
      )}

    </div>

  );

}