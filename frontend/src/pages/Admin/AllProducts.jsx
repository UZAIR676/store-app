import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";

const AllProducts = () => {
  const { data: products, isLoading, isError } = useAllProductsQuery();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />
      <div className="xl:ml-16 px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-pink-500 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-white">All Products</h1>
            <p className="text-gray-500 text-sm mt-0.5">{products?.length || 0} products in store</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader /></div>
        ) : isError ? (
          <div className="text-red-400 text-center py-20">Error loading products</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/admin/product/update/${product._id}`}
                className="group bg-gray-900 border border-gray-800 hover:border-pink-600/50 rounded-2xl p-4 flex gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-pink-900/10"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-700 flex-shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <h5 className="text-white font-semibold text-base truncate">{product.name}</h5>
                    <span className="text-gray-500 text-xs whitespace-nowrap flex-shrink-0">
                      {moment(product.createdAt).format("MMM D, YYYY")}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                    {product.description?.substring(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-pink-400 font-bold text-sm">$ {product.price}</span>
                    <span className="text-[11px] font-bold uppercase tracking-widest bg-pink-500/10 border border-pink-500/30 text-pink-400 px-3 py-1 rounded-full group-hover:bg-pink-500/20 transition-colors">
                      Edit →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;