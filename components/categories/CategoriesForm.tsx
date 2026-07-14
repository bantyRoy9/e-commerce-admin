"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@/services/uploadService";
import {
  createCategory,
  updateCategory,
} from "@/services/categoryService";

interface Props {
  initialData?: {
    _id?: string;
    name: string;
    image: string;
    isActive: boolean;
  };
}

export default function CategoryForm({
  initialData,
}: Props) {

  const router = useRouter();

  const [name, setName] = useState(
    initialData?.name || ""
  );

  const [image, setImage] = useState(
    initialData?.image || ""
  );

  const [isActive, setIsActive] = useState(
    initialData?.isActive ?? true
  );

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);
    

  const isEdit = !!initialData?._id;

  // Upload Image

const handleImageUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  try {
    setUploading(true);

    const data = await uploadImage(file);

    setImage(data.imageUrl);

  } catch (error) {
    console.log(error);
    alert("Image upload failed");
  } finally {
    setUploading(false);
  }
};
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (!name.trim()) {

      alert("Category name is required");

      return;

    }

    try {

      setLoading(true);

      const payload = {
        name,
        image,
        isActive,
      };

      if (isEdit) {

        await updateCategory(
          initialData!._id!,
          payload
        );

        alert("Category Updated");

      } else {

        await createCategory(
          payload
        );

        alert("Category Created");

      }

      router.push("/categories");

    } catch (error: any) {

      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-8 space-y-6"
    >

      {/* Category Name */}

      <div>

        <label className="block mb-2 font-semibold">

          Category Name

        </label>

        <input
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
          placeholder="Enter category name"
          className="w-full border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

      </div>

      {/* Upload */}

      <div>

        <label className="block mb-2 font-semibold">

          Upload Image

        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full border border-slate-200 rounded-lg p-3"
        />

        {uploading && (

          <p className="text-green-600 mt-2">

            Uploading...

          </p>

        )}

      </div>

      {/* OR */}

      <div className="text-center text-gray-500">

        OR

      </div>

      {/* Image URL */}

     
      {/* Preview */}

      {image && (

        <div>

          <label className="block mb-2 font-semibold">

            Preview

          </label>

          <Image
            src={image}
            alt="Category"
            width={150}
            height={150}
            className="rounded-lg border border-slate-200 object-cover"
          />

        </div>

      )}

      {/* Active */}

      <div className="flex items-center gap-3">

        <input
          type="checkbox"
          checked={isActive}
          onChange={(e)=>
            setIsActive(e.target.checked)
          }
        />

        <span>

          Active Category

        </span>

      </div>

      {/* Buttons */}

      <div className="flex gap-4">

        <button
          type="submit"
          disabled={loading || uploading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
        >

          {loading
            ? "Saving..."
            : isEdit
            ? "Update Category"
            : "Save Category"}

        </button>

        <button
          type="button"
          onClick={() =>
            router.back()
          }
          className="border border-slate-200 px-6 py-3 rounded-lg hover:bg-gray-100"
        >

          Cancel

        </button>

      </div>

    </form>

  );

}