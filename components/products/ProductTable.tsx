"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import { deleteProduct } from "@/services/productServices";
import { Product } from "@/types/product";

interface Props {
  products: Product[];
  loading: boolean;
  refresh: () => void;
}

export default function ProductTable({
  products,
  loading,
  refresh,
}: Props) {

  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {

    return products.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [products, search]);

  const handleDelete = async (id: string) => {

    if (!confirm("Delete this product?")) return;

    try {

      await deleteProduct(id);

      refresh();

    } catch (error) {

      console.log(error);

      alert("Unable to delete product");

    }

  };

  if (loading) {

    return (

      <div className="rounded-3xl bg-white p-12 text-center shadow">

        Loading Products...

      </div>

    );

  }

  return (

    <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

      {/* Search */}

      <div className="flex items-center justify-between border-b border-gray-200 p-6">

        <div className="relative">

          <MagnifyingGlassIcon className="absolute left-4 top-3 h-5 w-5 text-gray-400" />

          <input
            placeholder="Search product..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-80 rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 outline-none transition focus:border-green-600 focus:bg-white"
          />

        </div>

        <div className="text-sm text-gray-500">

          {filteredProducts.length} Products

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full ">

          <thead className="sticky top-0 bg-slate-50 ">

            <tr className="text-left text-xs font-semibold  tracking-wide text-slate-600 border border-slate-200">

              <th className="px-6 py-4">
                Product
              </th>

              <th className="px-6 py-4">
                Category
              </th>

              <th className="px-6 py-4">
                Price
              </th>

              <th className="px-6 py-4">
                Stock
              </th>

              <th className="px-6 py-4">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((product) => {

              const status =
                product.stock === 0
                  ? "Out"
                  : product.stock < 5
                  ? "Low"
                  : "Available";

              return (

                <tr
                  key={product._id}
                  className="border-t border-slate-200 transition hover:bg-green-50"
                >

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-8">

                      <img
                        src={
                          product.image ||
                          "https://placehold.co/100"
                        }
                        alt={product.name}
                        className="h-16 w-16 rounded-2xl bg-green-50 object-cover border border-gray-200 p-2"
                      />

                      <div>

                        <h3 className="font-semibold text-slate-800 text-xs ">

                          {product.name}

                        </h3>

                        <p className=" text-gray-500 text-xs">

                          {product.description || "No description"}

                        </p>
                        <p className=" text-gray-500 text-xs">

                          SKU: {"N/A"}

                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6">

                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm text-green-600">

                      {product.category}

                    </span>

                  </td>

                  <td className="px-6 font-semibold text-gray-700 text-sm">

                    ₹ {product.price}

                  </td>

                  <td className="px-6  text-sm">

                    {product.stock} {product.unit}

                  </td>

                  <td className="px-6  text-sm">

                    {status === "Available" && (

                      <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-normal text-green-700">
                        In Stock
                      </span>

                    )}

                    {status === "Low" && (

                      <span className="rounded-xl bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        Low Stock
                      </span>

                    )}

                    {status === "Out" && (

                      <span className="rounded-xl bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                        Out of Stock

                      </span>

                    )}

                  </td>

                  <td className="px-6">

                    <div className="flex justify-center gap-3">

                      <Link
                        href={`/products/${product._id}/edit`}
                        className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                      >

                        <PencilSquareIcon className="h-5 w-5" />

                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(product._id)
                        }
                        className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
                      >

                        <TrashIcon className="h-5 w-5" />

                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

  );

}