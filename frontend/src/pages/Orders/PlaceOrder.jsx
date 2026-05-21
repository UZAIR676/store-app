import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) navigate("/shipping");
  }, [cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-10">
        <ProgressSteps step1 step2 step3 />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Review Order</h1>
            <p className="text-gray-500 text-sm mt-0.5">Step 3 of 3 — confirm before placing</p>
          </div>
        </div>

        {cart.cartItems.length === 0 ? (
          <Message>Your cart is empty</Message>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left — Items */}
            <div className="flex-1 flex flex-col gap-5">

              {/* Cart Items */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Items ({cart.cartItems.length})</p>
                </div>
                <div className="divide-y divide-gray-800">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 px-6 py-4">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-gray-700 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product}`} className="text-pink-400 hover:text-pink-300 text-sm font-medium truncate block transition-colors">
                          {item.name}
                        </Link>
                        <p className="text-gray-500 text-xs mt-1">{item.qty} × ${item.price}</p>
                      </div>
                      <span className="text-white font-bold text-sm flex-shrink-0">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping & Payment info */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Shipping Address</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                    {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Payment Method</p>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{cart.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Order Summary</p>

                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Items</span>
                    <span className="text-white">${cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className="text-white">${cart.shippingPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span className="text-white">${cart.taxPrice}</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-white text-base">
                    <span>Total</span>
                    <span>${cart.totalPrice}</span>
                  </div>
                </div>

                {error && <Message variant="danger">{error.data.message}</Message>}

                <button
                  type="button"
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                  className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3 text-sm hover:shadow-lg hover:shadow-pink-900/40"
                >
                  {isLoading ? "Placing Order..." : "Place Order"}
                </button>

                {isLoading && <div className="flex justify-center"><Loader /></div>}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceOrder;