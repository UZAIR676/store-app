import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {!keyword ? <Header /> : null}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader />
        </div>
      ) : isError ? (
        <div className="max-w-2xl mx-auto px-4 py-16">
          <Message variant="danger">
            {isError?.data?.message || isError.error}
          </Message>
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          {!keyword && (
            <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-pink-950 border-b border-gray-800">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600 opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-800 opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              <div className="relative max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">
                    Curated for you
                  </p>
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white">
                    Special <br />
                    <span className="text-pink-500">Products</span>
                  </h1>
                  <p className="mt-4 text-gray-400 text-lg max-w-md">
                    Hand-picked deals and exclusive items just for you. Updated every week.
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="group flex items-center gap-3 bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-bold rounded-full py-4 px-10 text-lg shadow-lg shadow-pink-900/40 hover:shadow-pink-600/40 hover:scale-105"
                >
                  Browse Shop
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="max-w-7xl mx-auto px-6 py-14">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-10">
              <div className="w-1 h-8 bg-pink-500 rounded-full" />
              <h2 className="text-2xl font-bold text-white">
                {keyword ? `Results for "${keyword}"` : "Featured Products"}
              </h2>
              <span className="ml-2 text-sm text-gray-500 font-medium">
                {data?.products?.length} items
              </span>
            </div>

            {/* Product Grid */}
            {data?.products?.length === 0 ? (
              <div className="text-center py-24 text-gray-500 text-lg">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <div
                    key={product._id}
                    className="group rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-pink-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 hover:-translate-y-1"
                  >
                    <Product product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;