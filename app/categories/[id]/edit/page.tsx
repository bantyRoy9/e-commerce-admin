"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/DashboardLayout";
import CategoryForm from "@/components/categories/CategoriesForm";

import {
  getCategory,
} from "@/services/categoryService";

export default function EditCategoryPage() {

  const { id } = useParams();

  const [category, setCategory] =
    useState<any>(null);

    const loadCategory = async () => {
  
      try {
  
        const data =
          await getCategory(id as string);
  
        setCategory(data);
  
      } catch (error) {
  
        console.log(error);
  
      }
  
    };
  useEffect(() => {

    loadCategory();

  }, []);


  if (!category) {

    return (
      <DashboardLayout>

        Loading...

      </DashboardLayout>
    );

  }

  return (

    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-3xl font-bold">

          Edit Category

        </h1>

      </div>

      <CategoryForm
        initialData={category}
      />

    </DashboardLayout>

  );

}