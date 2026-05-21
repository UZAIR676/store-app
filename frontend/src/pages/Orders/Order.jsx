import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Messsage from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from "../../redux/api/orderApiSlice";

const Order = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPaPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPaPal && paypal.clientId) {
      const loadingPaPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: { "client-id": paypal.clientId, currency: "USD" },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) loadingPaPalScript();
      }
    }
  }, [errorPayPal, loadingPaPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Order is paid");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function createOrder(data, actions) {
    return actions.order
      .create({ purchase_units: [{ amount: { value: order.totalPrice } }] })
      .then((orderID) => orderID);
  }

  function onError(err) {
    toast.error(err.message);
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{label}</span>
      <span className="text-sm text-gray-200">{value}</span>
    </div>
  );

  return isLoading ? (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader />
    </div>
  ) : error ? (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
      <Messsage variant="danger">{error.data.message}</Messsage>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-3xl font-bold">Order Details</h1>
            <p className="text-gray-500 text-sm mt-0.5 font-mono">#{order._id}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left — Items */}
          <div className="flex-1 flex flex-col gap-6">

            {/* Order Items */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Items Ordered</p>
              </div>

              {order.orderItems.length === 0 ? (
                <div className="p-6">
                  <Messsage>Order is empty</Messsage>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/40 transition-colors">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="text-pink-400 hover:text-pink-300 font-medium text-sm truncate block transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-xs mt-1">
                          {item.qty} × ${item.price}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold text-sm">
                          ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-5">Shipping Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <InfoRow label="Customer" value={order.user.username} />
                <InfoRow label="Email" value={order.user.email} />
                <InfoRow
                  label="Address"
                  value={`${order.shippingAddress.address}, ${order.shippingAddress.city} ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}`}
                />
                <InfoRow label="Payment Method" value={order.paymentMethod} />
              </div>

              <div className="mt-5">
                {order.isPaid ? (
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Paid on {new Date(order.paidAt).toLocaleDateString()}
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    Payment Pending
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right — Summary */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-5">

            {/* Price Breakdown */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-5">Order Summary</p>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Items</span>
                  <span className="text-white">${order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span className="text-white">${order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax</span>
                  <span className="text-white">${order.taxPrice}</span>
                </div>
                <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-white text-base">
                  <span>Total</span>
                  <span>${order.totalPrice}</span>
                </div>
              </div>

              {/* Delivery Status */}
              <div className="mt-5">
                {order.isDelivered ? (
                  <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                    Delivered
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                    Not Delivered Yet
                  </div>
                )}
              </div>
            </div>

            {/* PayPal */}
            {!order.isPaid && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Payment</p>
                {loadingPay && <Loader />}
                {isPending ? (
                  <Loader />
                ) : (
                  <PayPalButtons
                    createOrder={createOrder}
                    onApprove={onApprove}
                    onError={onError}
                  />
                )}
              </div>
            )}

            {/* Admin — Mark Delivered */}
            {loadingDeliver && <Loader />}
            {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
              <button
                type="button"
                onClick={deliverHandler}
                className="group w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-bold rounded-full py-3.5 text-base hover:shadow-lg hover:shadow-pink-900/40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark As Delivered
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;