"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { Category } from "@/types/category";
import { deleteCategory } from "@/services/categoryService";

interface Props {
  categories: Category[];
  loading: boolean;
  refresh: () => void;
}

export default function CategoryTable({
  categories,
  loading,
  refresh,
}: Props) {

  const [search, setSearch] =
    useState("");

  const filteredCategories =
    useMemo(() => {

      return categories.filter(category =>
        category.name
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    }, [categories, search]);

  const handleDelete = async (
    id: string
  ) => {

    if (
      !confirm(
        "Delete this category?"
      )
    )
      return;

    try {

      await deleteCategory(id);

      refresh();

    } catch (error) {

      console.log(error);

      alert(
        "Unable to delete category"
      );

    }

  };

  if (loading) {

    return (

      <div className="rounded-3xl bg-white p-12 text-center shadow">

        Loading Categories...

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
            placeholder="Search category..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-80 rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 outline-none transition focus:border-green-600 focus:bg-white"
          />

        </div>

        <div className="text-sm text-gray-500">

          {filteredCategories.length}
          {" "}
          Categories

        </div>

      </div>

      {filteredCategories.length === 0 ? (

        <div className="py-20 text-center">

          <h2 className="text-2xl font-bold">

            No Categories Found

          </h2>

          <p className="mt-2 text-gray-500">

            Create your first category.

          </p>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="sticky top-0 bg-slate-50">

              <tr className="text-left text-xs font-semibold  tracking-wide text-slate-600">

                <th className="px-6 py-4">

                  Category

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

              {filteredCategories.map(
                category => (

                  <tr
                    key={category._id}
                    className="border-t border-gray-200 transition hover:bg-green-50"
                  >

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={
                            category.image ||
                            "https://placehold.co/100"
                          }
                          alt={
                            category.name
                          }
                          className="h-16 w-16 rounded-2xl border bg-gray-50 object-cover p-3 border-gray-200"
                        />

                        <div>

                          <h3 className="font-semibold text-slate-800 text-xs">

                            {
                              category.name
                            }

                          </h3>

                          <p className="text-xs text-gray-500 ">

                            Product Category

                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-6">

                      {category.isActive ? (

                        <span className="rounded-xl bg-green-100 px-3 py-1 text-xs font-normal text-green-700">

                          Active

                        </span>

                      ) : (

                        <span className="rounded-xl bg-red-100 px-3 py-1 text-xs font-normal text-red-700">

                          Inactive

                        </span>

                      )}

                    </td>

                    <td className="px-6">

                      <div className="flex justify-center gap-3">

                        <Link
                          href={`/categories/${category._id}/edit`}
                          className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700"
                        >

                          <PencilSquareIcon className="h-5 w-5" />

                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              category._id
                            )
                          }
                          className="rounded-xl bg-red-500 p-3 text-white transition hover:bg-red-600"
                        >

                          <TrashIcon className="h-5 w-5" />

                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}