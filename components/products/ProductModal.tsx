"use client";

import { createProduct } from "@/services/productServices";
import { useState } from "react";


interface Props {
  open: boolean;
  onClose: () => void;
  refresh: () => void;
}

export default function ProductModal({
  open,
  onClose,
  refresh,
}: Props) {

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",

      category: "",

      price: "",

      stock: "",

      unit: "kg",

      image: "",

      description: "",

    });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  const handleSave =
    async () => {

      try {

        setLoading(true);

        await createProduct({

          ...form,

          price: Number(
            form.price,
          ),

          stock: Number(
            form.stock,
          ),

        });

        refresh();

        onClose();

      } catch (error) {

        console.log(error);

        alert(
          "Failed to create product",
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">

      <div className="bg-white rounded-2xl w-[550px] p-8">

        <h2 className="text-3xl font-bold mb-8">

          Add Product

        </h2>

        <div className="space-y-4">

          <input
            name="name"
            placeholder="Product Name"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="category"
            placeholder="Category"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="stock"
            placeholder="Stock"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="unit"
            placeholder="kg"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="image"
            placeholder="Image URL"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

          <input
            name="description"
            placeholder="Description"
            className="border rounded-xl h-12 px-4 w-full"
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            className="border px-6 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-3 rounded-xl"
          >
            {loading
              ? "Saving..."
              : "Save Product"}
          </button>

        </div>

      </div>

    </div>

  );

}