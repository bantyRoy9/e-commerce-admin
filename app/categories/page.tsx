"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CategoryTable from "@/components/categories/CategoriesTable";

import { getCategories } from "@/services/categoryService";
import { Category } from "@/types/category";

import {
  Squares2X2Icon,
  PlusIcon,
} from "@heroicons/react/24/outline";

export default function CategoriesPage() {

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadCategories = async () => {

    try {

      const data = await getCategories();

      setCategories(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadCategories();

  }, []);

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div className="">

          <div className="flex items-center gap-3 mt-4">

            <div className="rounded-2xl bg-green-100 p-3">

              <Squares2X2Icon className="h-7 w-7 text-green-600" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-800">

                Categories

              </h1>

              <p className="mt-1 text-gray-500 text-xs">

                Manage all grocery categories in your store

              </p>

            </div>

          </div>

        </div>

        <Link
          href="/categories/add"
          className="flex text-sm mt-4 items-center gap-2 rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700"
        >

          <PlusIcon className="h-4 w-4" />

          Add Category

        </Link>

      </div>

      {/* Table */}

      <CategoryTable
        loading={loading}
        categories={categories}
        refresh={loadCategories}
      />

    </DashboardLayout>

  );

}