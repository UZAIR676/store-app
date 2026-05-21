import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, label: "Write Review" },
    { id: 2, label: `Reviews (${product.reviews?.length || 0})` },
    { id: 3, label: "Related" },
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      {/* Tab headers */}
      <div className="flex border-b border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-sm font-semibold transition-colors ${
              activeTab === tab.id
                ? "text-white border-b-2 border-pink-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Write Review */}
        {activeTab === 1 && (
          <div>
            {userInfo ? (
              <form onSubmit={submitHandler} className="flex flex-col gap-4 max-w-lg">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Rating</label>
                  <select
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  >
                    <option value="">Select rating</option>
                    <option value="1">1 — Inferior</option>
                    <option value="2">2 — Decent</option>
                    <option value="3">3 — Great</option>
                    <option value="4">4 — Excellent</option>
                    <option value="5">5 — Exceptional</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Comment</label>
                  <textarea
                    rows={4}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold rounded-full py-3 text-sm"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="text-gray-400 text-sm">
                Please{" "}
                <Link to="/login" className="text-pink-400 hover:text-pink-300 font-semibold">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="flex flex-col gap-4">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 text-xs font-bold uppercase">
                        {review.name?.[0]}
                      </div>
                      <span className="text-white text-sm font-semibold">{review.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="text-gray-300 text-sm mt-2">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Related Products */}
        {activeTab === 3 && (
          <div>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader /></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {data?.map((product) => (
                  <SmallProduct key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;