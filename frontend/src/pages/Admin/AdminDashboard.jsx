import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import { FiDollarSign, FiUsers, FiShoppingBag } from "react-icons/fi";

const StatCard = ({ icon: Icon, label, value, isLoading }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-5 hover:border-pink-600/40 transition-all duration-300">
    <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
      <Icon className="text-pink-400" size={20} />
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-1">{label}</p>
      <p className="text-2xl font-bold text-white">
        {isLoading ? <Loader /> : value}
      </p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "bar",
        background: "transparent",
        toolbar: { show: false },
      },
      tooltip: { theme: "dark" },
      colors: ["#ec4899"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      grid: {
        borderColor: "#1f2937",
        strokeDashArray: 4,
      },
      markers: { size: 4, colors: ["#ec4899"], strokeWidth: 0 },
      xaxis: {
        categories: [],
        labels: { style: { colors: "#6b7280", fontSize: "12px" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: "#6b7280", fontSize: "12px" } },
        min: 0,
      },
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: "50%",
        },
      },
      legend: { show: false },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: ["#9d174d"],
          stops: [0, 100],
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));
      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />

      <div className="xl:ml-64 md:ml-16 px-6 py-10">

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon={FiDollarSign}
            label="Total Sales"
            value={`$${isLoading ? "" : sales?.totalSales?.toFixed(2)}`}
            isLoading={isLoading}
          />
          <StatCard
            icon={FiUsers}
            label="Customers"
            value={loading ? "" : customers?.length}
            isLoading={loading}
          />
          <StatCard
            icon={FiShoppingBag}
            label="Total Orders"
            value={loadingTwo ? "" : orders?.totalOrders}
            isLoading={loadingTwo}
          />
        </div>

        {/* Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-pink-500 rounded-full" />
            <h2 className="text-base font-semibold text-white">Sales Trend</h2>
          </div>
          <Chart
            options={state.options}
            series={state.series}
            type="bar"
            height={300}
            width="100%"
          />
        </div>

        {/* Order List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-5 bg-pink-500 rounded-full" />
            <h2 className="text-base font-semibold text-white">Recent Orders</h2>
          </div>
          <OrderList />
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;