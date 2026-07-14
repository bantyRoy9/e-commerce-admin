"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CategoryForm from "@/components/categories/CategoriesForm";

export default function AddCategoryPage() {
  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Category
        </h1>

        <p className="text-gray-500 mt-2">
          Create a new product category
        </p>

      </div>

      <CategoryForm />

    </DashboardLayout>
  );
}