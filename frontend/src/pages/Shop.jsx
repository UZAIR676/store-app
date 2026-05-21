import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) => {
          return (
            product.price.toString().includes(priceFilter) ||
            product.price === parseInt(priceFilter, 10)
          );
        });
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  const SectionLabel = ({ children }) => (
    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-3 px-1">
      {children}
    </p>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-1 h-8 bg-pink-500 rounded-full" />
            <h1 className="text-3xl font-bold">Shop</h1>
            <span className="text-sm text-gray-500">{products?.length} products</span>
          </div>

          {/* Mobile filter toggle */}
          <button
            className="lg:hidden flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-300 text-sm px-4 py-2 rounded-xl hover:border-pink-500/50 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M10 12h4" />
            </svg>
            Filters
          </button>
        </div>

        <div className="flex gap-8 items-start">

          {/* Sidebar */}
          <aside className={`
            w-64 flex-shrink-0 flex flex-col gap-5
            lg:block
            ${sidebarOpen ? "block" : "hidden"}
            fixed lg:static inset-0 z-40 lg:z-auto
            bg-gray-950 lg:bg-transparent
            p-6 lg:p-0 overflow-y-auto
          `}>
            {/* Mobile close */}
            <button
              className="lg:hidden self-end text-gray-500 hover:text-white mb-2"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>

            {/* Categories */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <SectionLabel>Categories</SectionLabel>
              <div className="flex flex-col gap-2">
                {categories?.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      onChange={(e) => handleCheck(e.target.checked, c._id)}
                      className="w-4 h-4 accent-pink-500 rounded"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {c.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <SectionLabel>Brands</SectionLabel>
              <div className="flex flex-col gap-2">
                {uniqueBrands?.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      id={brand}
                      name="brand"
                      onChange={() => handleBrandClick(brand)}
                      className="w-4 h-4 accent-pink-500"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                      {brand}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <SectionLabel>Price</SectionLabel>
              <input
                type="text"
                placeholder="Enter max price..."
                value={priceFilter}
                onChange={handlePriceChange}
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-3 py-2.5 focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            {/* Reset */}
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium rounded-xl py-2.5 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Reset Filters
            </button>
          </aside>

          {/* Mobile overlay backdrop */}
          {sidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/60 z-30"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                  </svg>
                </div>
                <p className="text-gray-500">No products found</p>
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products?.map((p) => (
                  <div
                    key={p._id}
                    className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-pink-600/60 transition-all duration-300 hover:shadow-xl hover:shadow-pink-900/20 hover:-translate-y-1"
                  >
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Shop;