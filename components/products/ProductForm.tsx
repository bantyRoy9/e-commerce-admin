"use client";

import ImageUploader from "@/components/common/ImageUploader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  createProduct,
  updateProduct,
} from "@/services/productServices";

import {
  getCategories,
} from "@/services/categoryService";

interface Props {
  initialData?: any;
}
interface Category {
  _id: string;
  name: string;
}

export default function ProductForm({
  initialData,
}: Props) {

  const router = useRouter();

  const [categories, setCategories] =
  useState<Category[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState(initialData?.name || "");

  const [category, setCategory] =
    useState(initialData?.category || "");

  const [price, setPrice] =
    useState(initialData?.price || "");

  const [stock, setStock] =
    useState(initialData?.stock || "");

  const [unit, setUnit] =
    useState(initialData?.unit || "kg");

  const [image, setImage] =
    useState(initialData?.image || "");
    const [imagePublicId, setImagePublicId] =
useState(initialData?.imagePublicId || "");

  const [description, setDescription] =
    useState(initialData?.description || "");

    const loadCategories = async () => {
  
      try {
  
        const data =
          await getCategories();
  
        setCategories(Array.isArray(data) ? data : []);
  
      } catch (error) {
  
        console.log(error);
  
      }
  
    };

   
  useEffect(() => {

    loadCategories();

  }, []);


const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  if (!name || !category || !price) {
    alert("Fill all required fields");
    return;
  }

  try {

    setLoading(true);

    const payload = {
    name,
    category,
    price: Number(price),
    stock: Number(stock),
    unit,
    image,
    imagePublicId,
    description,
};

    if (initialData?._id) {

      await updateProduct(
        initialData._id,
        payload
      );

      alert("Product Updated Successfully");

    } else {

      await createProduct(
        payload
      );

      alert("Product Created Successfully");

    }

    router.push("/products");

  } catch (error: any) {

    console.log(error);

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
      className="bg-white p-8 rounded-xl shadow space-y-6"
    >

      <div>

        <label>
          Product Name
        </label>

        <input
          className="w-full border border-slate-200 rounded-lg p-3 mt-2"
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
        />

      </div>

      <div>

        <label>
          Category
        </label>

        <select
          className="w-full border border-slate-200 rounded-lg p-3 mt-2"
          value={category}
          onChange={(e)=>
            setCategory(
              e.target.value
            )
          }
        >

          <option value="">
            Select Category
          </option>

          {categories.map((cat)=>(
            <option
              key={cat._id}
              value={cat.name}
            >
              {cat.name}
            </option>
          ))}

        </select>

      </div>

      <div className="grid grid-cols-3 gap-4">

        <div>

          <label>
            Price
          </label>

          <input
            type="number"
            className="w-full border border-slate-200 rounded-lg p-3 mt-2"
            value={price}
            onChange={(e)=>
              setPrice(e.target.value)
            }
          />

        </div>

        <div>

          <label>
            Stock
          </label>

          <input
            type="number"
            className="w-full border border-slate-200 rounded-lg p-3 mt-2"
            value={stock}
            onChange={(e)=>
              setStock(e.target.value)
            }
          />

        </div>

        <div>

          <label>
            Unit
          </label>

          <select
            className="w-full border border-slate-200 rounded-lg p-3 mt-2"
            value={unit}
            onChange={(e)=>
              setUnit(e.target.value)
            }
          >

            <option>kg</option>
            <option>gm</option>
            <option>ltr</option>
            <option>pcs</option>

          </select>

        </div>

      </div>

      <div>

 <ImageUploader
    image={image}
    setImage={setImage}
    imagePublicId={imagePublicId}
    setImagePublicId={setImagePublicId}
/>

</div>

      <div>

        <label>
          Description
        </label>

        <textarea
          rows={4}
          className="w-full border border-slate-200 rounded-lg p-3 mt-2"
          value={description}
          onChange={(e)=>
            setDescription(
              e.target.value
            )
          }
        />

      </div>

      <button
  type="submit"
  disabled={loading}
  className="bg-green-600 text-white px-8 py-3 rounded-lg disabled:opacity-50"
>
  {loading
    ? "Saving..."
    : initialData?._id
    ? "Update Product"
    : "Save Product"}
</button>

    </form>

  );

}