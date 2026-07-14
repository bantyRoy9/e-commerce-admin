"use client";

import { useEffect, useState } from "react";
import { IAMGuard } from "@/lib/iamGuard";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardCard from "@/components/dashboard/DashboardCard";
import LatestOrders from "@/components/dashboard/LatestOrders";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentPayments from "@/components/dashboard/RecentPayments";

import {
  CubeIcon,
  CurrencyRupeeIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

import socket from "@/services/socket";
import { getDashboard } from "@/services/dashboardService";
import { useNotification } from "@/hooks/useNotification";
import SalesCategory from "@/components/dashboard/SalesCategory";

type DashboardData = {
  todayOrders?: number;
  revenue?: number;
  totalProducts?: number;
};

function DashboardContent() {

  const [dashboard, setDashboard] =
    useState<DashboardData | null>(null);
console.log("dashboard", dashboard);
  const [notification, setNotification] =
    useState<string | null>(null);

  const { addOrderNotification } =
    useNotification();

  const loadDashboard = async () => {

    try {

      const data =
        await getDashboard();

      setDashboard(data);

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    loadDashboard();

    socket.on(
      "newOrder",
      (order) => {

        setNotification(
          `🎉 New Order Received (${order?.orderNumber ?? "#"
          })`
        );

        addOrderNotification();

        loadDashboard();

        setTimeout(() => {

          setNotification(null);

        }, 5000);

      }
    );

    return () => {

      socket.off("newOrder");

    };

  }, [addOrderNotification]);

  return (

    <DashboardLayout>

      {/* Heading */}

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h1 className="text-xl font-bold text-slate-800">

            Welcome back, Admin! 👋

          </h1>

          <p className="mt-2 text-slate-500 text-xs">

            Here's what's happening with your store today.

          </p>

        </div>

        <div className="rounded-2xl bg-green-50 px-6 py-4">

          <p className="text-sm text-slate-500">

            Today's Revenue

          </p>

          <h2 className="mt-1 text-sm font-bold text-green-600">

            ₹ {dashboard?.revenue ?? 0}

          </h2>

        </div>

      </div>

      {/* Notification */}

      {notification && (

        <div className="mb-6 rounded-3xl border-2 border-red-400 bg-green-50 px-6 py-4 text-green-700 shadow-sm">

          {notification}

        </div>

      )}

      {/* Cards */}

     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

       <DashboardCard
  title="Today's Orders"
  value={String(dashboard?.todayOrders ?? 0)}
  change="12.5%"
  icon={
    <ShoppingBagIcon className="w-8 h-8 text-green-600" />
  }
  iconBg="bg-green-100"
/>

<DashboardCard
  title="Total Revenue"
  value={`₹${dashboard?.revenue ?? 0}`}
  change="18.4%"
  icon={
    <CurrencyRupeeIcon className="w-8 h-8 text-green-600" />
  }
  iconBg="bg-green-100"
/>

<DashboardCard
  title="Total Products"
  value={String(dashboard?.totalProducts ?? 0)}
  change="5.2%"
  icon={
    <CubeIcon className="w-8 h-8 text-orange-500" />
  }
  iconBg="bg-orange-100"
/>

<DashboardCard
  title="Growth"
  value="+18%"
  change="8.7%"
  icon={
    <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600" />
  }
  iconBg="bg-purple-100"
/>

      </div>

      {/* Graph */}

      <div className="mt-8 grid grid-cols-3 gap-6">

        <div className="col-span-2">

        <LatestOrders />

        </div>

        <RecentPayments />

      </div>

      {/* Orders */}

      <div className="grid grid-cols-3 gap-6 mt-6">
  <div className="col-span-2">
    <RevenueChart />
  </div>

  <SalesCategory />
</div>

    </DashboardLayout>

  );

}

export default function Dashboard() {
  return (
    <IAMGuard>
      <DashboardContent />
    </IAMGuard>
  );
}