"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductTable from "@/components/products/ProductTable";

import { getProducts } from "@/services/productServices";
import { Product } from "@/types/product";

import {
  PlusIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";

export default function ProductsPage() {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadProducts = async () => {

    try {

      const data = await getProducts();

      setProducts(data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadProducts();

  }, []);

  return (

    <DashboardLayout>

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <div className="flex items-center gap-3 mt-4">

            <div className="rounded-2xl bg-green-100 p-3">

              <CubeIcon className="h-7 w-7 text-green-600" />

            </div>

            <div>

              <h1 className="text-xl font-bold text-slate-800">

                Products

              </h1>

              <p className="mt-2 text-slate-500 text-xs">

                Manage all grocery products in your store

              </p>

            </div>

          </div>

        </div>

        <Link
          href="/products/add"
          className="flex text-sm mt-4 items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-green-700"
        >

          <PlusIcon className="h-4 w-4" />

          Add Product

        </Link>

      </div>

      {/* Table */}

      <ProductTable
        products={products}
        loading={loading}
        refresh={loadProducts}
      />

    </DashboardLayout>

  );

}