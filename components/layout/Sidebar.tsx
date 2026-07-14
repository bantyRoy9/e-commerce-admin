"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  HomeIcon,
  CubeIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

const menus = [
  {
    title: "Dashboard",
    href: "/",
    icon: HomeIcon,
  },
  {
    title: "Products",
    href: "/products",
    icon: CubeIcon,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: Squares2X2Icon,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingBagIcon,
  },
];

export default function Sidebar() {

  const pathname = usePathname();

  return (

    <aside className="w-72 bg-green-50 border-r border-slate-200 flex flex-col">

      {/* Logo */}

      <div className="px-8 py-6 border-b border-slate-200">

        <div className="flex justify-center items-center gap-4">
            <h2 className="text-2xl font-bold text-green-600">
              THELA
            </h2>
        </div>
      </div>

      {/* Menu */}

      <nav className=" px-5 py-6">       

        {menus.map((menu) => {

          const Icon = menu.icon;
          const active =
  menu.href === "/"
    ? pathname === "/"
    : pathname.startsWith(menu.href);

          return (

            <Link
              key={menu.href}
              href={menu.href}
              className={`group mb-2 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300
text-sm font-medium
              ${
                active
                  ? "bg-green-600 text-white shadow-lg"
                  : "text-slate-800 hover:bg-green-50 hover:text-green-700"
              }`}
            >

              <Icon
                className={`h-6 w-6

                ${
                  active
                    ? "text-white"
                    : "text-slate-800 group-hover:text-green-600"
                }`}
              />

              <span className="font-medium">

                {menu.title}

              </span>

            </Link>

          );

        })}

      </nav>

      {/* Bottom Banner */}

      <div className="p-5">

        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 p-5 text-white shadow-lg">

          <Image
            src="/bucket.png"
            alt="Grow Your Store"
            width={110}
            height={100}
            className="mx-auto"            loading="eager"          />

          <h3 className="mt-4 text-sm font-bold text-slate-800">

            Grow your store

          </h3>

          <p className="mt-2 text-xs text-slate-600">

            Add new products and categories to boost your sales.

          </p>

          <Link
            href="/products/add"
            className="w-full text-sm mt-5 text-center inline-block rounded-xl text-white px-5 py-3 font-semibold bg-green-600 transition "
          >

            Add Product

          </Link>

        </div>

<div className="flex  mt-5 gap-4 overflow-hidden border border-slate-200 rounded-xl bg-gradient-to-br from-green-50 via-green-50 to-emerald-50 p-5 text-white shadow-lg" >
  <div className="shrink-0 text-center bg-green-600 rounded-full w-12 h-12 flex items-center justify-center">
    A
  </div>
  <div className="flex flex-col justify-center ">
    <h3 className="text-sm font-bold text-slate-800">
      Admin
    </h3>
    <p className="mt-1 text-xs text-slate-600">   
      admin@thela.com
      </p></div>
</div>
      </div>

    </aside>

  );

}