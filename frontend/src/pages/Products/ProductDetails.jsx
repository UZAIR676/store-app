import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-pink-400 text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]"><Loader /></div>
      ) : error ? (
        <div className="max-w-2xl mx-auto px-6 py-16">
          <Message variant="danger">{error?.data?.message || error.message}</Message>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Product Top Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14">

            {/* Image */}
            <div className="relative">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full object-cover"
                />
              </div>
              <div className="absolute top-4 right-4">
                <HeartIcon product={product} />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-5">
              {/* Name & price */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
                <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
              </div>

              <div className="text-4xl font-extrabold text-white">$ {product.price}</div>

              {/* Ratings */}
              <div className="flex items-center gap-3">
                <Ratings value={product.rating} text={`${product.numReviews} reviews`} />
              </div>

              {/* Meta info */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
                {[
                  { icon: FaStore, label: "Brand", value: product.brand },
                  { icon: FaClock, label: "Added", value: moment(product.createdAt).fromNow() },
                  { icon: FaStar, label: "Reviews", value: product.numReviews },
                  { icon: FaShoppingCart, label: "Quantity", value: product.quantity },
                  { icon: FaBox, label: "In Stock", value: product.countInStock },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="text-pink-400 flex-shrink-0" size={14} />
                    <span className="text-gray-500 text-xs">{label}:</span>
                    <span className="text-white text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* Qty + Add to cart */}
              <div className="flex items-center gap-3">
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-3 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                )}
                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3 text-sm hover:shadow-lg hover:shadow-pink-900/40"
                >
                  <FaShoppingCart size={15} />
                  {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <ProductTabs
            loadingProductReview={loadingProductReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            product={product}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;