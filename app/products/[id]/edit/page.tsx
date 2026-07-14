"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductForm from "@/components/products/ProductForm";

import { getProduct } from "@/services/productServices";

export default function EditProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const loadProduct = async () => {
    try {
      const data = await getProduct(id as string);

      setProduct(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadProduct();
  }, []);


  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center">
          Loading Product...
        </div>
      </DashboardLayout>
    );
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="p-10 text-center text-red-500">
          Product not found
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="text-gray-500">
          Update product information
        </p>

      </div>

      <ProductForm
        initialData={product}
      />

    </DashboardLayout>
  );
}