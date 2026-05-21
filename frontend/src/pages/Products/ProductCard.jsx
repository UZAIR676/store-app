import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="group relative flex flex-col h-full bg-gray-900 border border-gray-800 hover:border-pink-600/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 hover:-translate-y-1">

      {/* Image */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-800">
        <Link to={`/product/${p._id}`}>
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Brand Badge */}
        <span className="absolute bottom-3 left-3 bg-gray-950/80 backdrop-blur-sm border border-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">
          {p?.brand}
        </span>

        <HeartIcon product={p} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* Name + Price */}
        <div className="flex justify-between items-start gap-2">
          <h5 className="text-sm font-medium text-gray-200 line-clamp-2 leading-snug">
            {p?.name}
          </h5>
          <span className="flex-shrink-0 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold px-2.5 py-1 rounded-full">
            {p?.price?.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {p?.description?.substring(0, 80)}...
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-800">
          <Link
            to={`/product/${p._id}`}
            className="group/btn flex items-center gap-1.5 text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors"
          >
            View Details
            <svg
              className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <button
            onClick={() => addToCartHandler(p, 1)}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all duration-200"
          >
            <AiOutlineShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;