import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";

const Product = ({ product }) => {
  return (
    <div className="relative flex flex-col h-full">
      {/* Image — fixed square aspect ratio, object-cover keeps proportions */}
      <div className="relative w-full aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <HeartIcon product={product} />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product._id}`}>
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-sm font-medium text-gray-200 leading-snug line-clamp-2 hover:text-white transition-colors">
              {product.name}
            </h2>
            <span className="flex-shrink-0 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold px-2.5 py-1 rounded-full">
              ${product.price}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;