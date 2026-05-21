import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  saveShippingAddress,
  savePaymentMethod,
} from "../../redux/features/cart/cartSlice";
import ProgressSteps from "../../components/ProgressSteps";

const InputField = ({ label, type = "text", placeholder, value, onChange, required }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
    />
  </div>
);

const Shipping = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [address, setAddress]       = useState(shippingAddress.address    || "");
  const [city, setCity]             = useState(shippingAddress.city        || "");
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode  || "");
  const [country, setCountry]       = useState(shippingAddress.country     || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) navigate("/shipping");
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-12">
      {/* Progress */}
      <div className="max-w-md mx-auto mb-10">
        <ProgressSteps step1 step2 />
      </div>

      <div className="max-w-md mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">Shipping & Payment</h1>
            <p className="text-gray-500 text-sm mt-0.5">Step 2 of 3</p>
          </div>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col gap-5">

          {/* Shipping Address Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
              Delivery Address
            </p>

            <InputField
              label="Street Address"
              placeholder="123 Main Street"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="City"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <InputField
                label="Postal Code"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <InputField
              label="Country"
              placeholder="United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          {/* Payment Method Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-4">
            <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">
              Payment Method
            </p>

            {/* PayPal Option */}
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                paymentMethod === "PayPal"
                  ? "border-pink-500/60 bg-pink-500/5"
                  : "border-gray-700 hover:border-gray-600"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="PayPal"
                checked={paymentMethod === "PayPal"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="accent-pink-500 w-4 h-4"
              />
              <div className="flex items-center gap-3 flex-1">
                {/* PayPal icon */}
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">PayPal</p>
                  <p className="text-xs text-gray-500">Pay with PayPal or Credit Card</p>
                </div>
              </div>
              {paymentMethod === "PayPal" && (
                <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="group w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-bold rounded-full py-3.5 text-base hover:shadow-lg hover:shadow-pink-900/40"
          >
            Continue to Order Review
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;