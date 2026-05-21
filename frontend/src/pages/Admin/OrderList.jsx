import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";

const StatusBadge = ({ ok, labelOk = "Completed", labelNo = "Pending" }) => (
  ok ? (
    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/30 text-green-400 rounded-full">
      {labelOk}
    </span>
  ) : (
    <span className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/30 text-red-400 rounded-full">
      {labelNo}
    </span>
  )
);

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />
      <div className="xl:ml-16 px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
            <p className="text-gray-500 text-sm mt-0.5">{orders?.length || 0} total orders</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  {["Item", "Order ID", "Customer", "Date", "Total", "Paid", "Delivered", ""].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-[11px] uppercase tracking-widest text-gray-500 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <img src={order.orderItems[0].image} alt={order._id} className="w-12 h-12 object-cover rounded-xl border border-gray-700" />
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 font-mono">{order._id.slice(-8)}...</td>
                    <td className="px-5 py-4 text-sm text-gray-300">{order.user ? order.user.username : "N/A"}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{order.createdAt ? order.createdAt.substring(0, 10) : "N/A"}</td>
                    <td className="px-5 py-4 text-sm font-semibold text-white">$ {order.totalPrice}</td>
                    <td className="px-5 py-4"><StatusBadge ok={order.isPaid} /></td>
                    <td className="px-5 py-4"><StatusBadge ok={order.isDelivered} /></td>
                    <td className="px-5 py-4">
                      <Link to={`/order/${order._id}`}>
                        <button className="text-[11px] font-bold uppercase tracking-widest bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50 text-pink-400 hover:text-pink-300 px-3 py-1.5 rounded-lg transition-all duration-200">
                          View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;