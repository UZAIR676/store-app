import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Page Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
          {cartItems.length > 0 && (
            <span className="ml-2 text-sm text-gray-500 font-medium">
              {totalQty} {totalQty === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
              <svg className="w-9 h-9 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <Link
              to="/shop"
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-semibold rounded-full py-3 px-8 hover:scale-105"
            >
              Browse Shop
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* Cart Items */}
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-5 bg-gray-900 border border-gray-800 hover:border-gray-700 transition-all duration-200 rounded-2xl p-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-pink-400 hover:text-pink-300 font-medium truncate block transition-colors"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">{item.brand}</p>
                    <p className="text-white font-bold mt-1">${item.price}</p>
                  </div>

                  {/* Qty Selector */}
                  <div className="flex-shrink-0">
                    <select
                      className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-pink-500 transition-colors cursor-pointer"
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-200"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-white mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Subtotal ({totalQty} {totalQty === 1 ? "item" : "items"})</span>
                    <span className="text-white">${totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Shipping</span>
                    <span className="text-green-400">Free</span>
                  </div>
                  <div className="border-t border-gray-800 pt-3 flex justify-between font-bold text-white text-lg">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>

                <button
                  onClick={checkoutHandler}
                  disabled={cartItems.length === 0}
                  className="w-full group flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3.5 text-base hover:shadow-lg hover:shadow-pink-900/40"
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <Link
                  to="/shop"
                  className="mt-3 w-full flex items-center justify-center text-sm text-gray-500 hover:text-pink-400 transition-colors py-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;