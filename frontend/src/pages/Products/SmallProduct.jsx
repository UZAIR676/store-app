import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const SmallProduct = ({ product }) => {
  return (
    <div className="group relative bg-gray-900 border border-gray-800 hover:border-pink-600/50 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <HeartIcon product={product} />
        </div>
      </div>
      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <div className="flex items-start justify-between gap-1">
            <h2 className="text-xs font-medium text-gray-300 hover:text-white transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h2>
            <span className="flex-shrink-0 text-pink-400 text-xs font-bold">${product.price}</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SmallProduct;