"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductForm from "@/components/products/ProductForm";

export default function AddProductPage() {
  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <p className="text-gray-500">
          Add a new grocery product
        </p>

      </div>

      <ProductForm />

    </DashboardLayout>
  );
}