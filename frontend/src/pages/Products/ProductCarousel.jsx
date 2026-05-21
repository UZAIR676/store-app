import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import moment from "moment";
import { FaBox, FaClock, FaShoppingCart, FaStar, FaStore } from "react-icons/fa";

const ArrowBtn = ({ onClick, direction }) => (
  <button
    onClick={onClick}
    className={`absolute top-[11rem] -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-900/80 border border-gray-700 text-gray-400 hover:text-white hover:border-pink-500/60 hover:bg-gray-800 transition-all duration-200 ${
      direction === "prev" ? "left-3" : "right-3"
    }`}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d={direction === "prev" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);

const StatPill = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/60 rounded-xl px-3 py-2">
    <Icon className="text-pink-400 flex-shrink-0" size={13} />
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="text-gray-200 text-xs font-semibold ml-auto">{value}</span>
  </div>
);

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <ArrowBtn direction="prev" />,
    nextArrow: <ArrowBtn direction="next" />,
    appendDots: (dots) => (
      <div style={{ bottom: "-28px" }}>
        <ul className="flex justify-center gap-1.5">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-1.5 h-1.5 rounded-full bg-gray-600 hover:bg-pink-500 transition-colors" />
    ),
  };

  return (
    <div className="w-full">
      {isLoading ? null : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="relative pb-10">
          <Slider {...settings}>
            {products.map(({ image, _id, name, price, description, brand, createdAt, numReviews, rating, quantity, countInStock }) => (
              <div key={_id} className="outline-none">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

                  {/* 
                    White bg matches product images (white backdrop)
                    object-contain = poori image, koi crop nahi
                  */}
                  <div className="relative w-full h-[22rem] bg-white flex items-center justify-center">
                    <img
                      src={image}
                      alt={name}
                      className="h-full w-full object-contain p-4"
                    />
                    <span className="absolute top-4 right-4 bg-gray-950/80 border border-pink-500/30 text-pink-400 text-sm font-bold px-3 py-1.5 rounded-full">
                      ${price}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-1">{name}</h2>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {description.substring(0, 160)}...
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <StatPill icon={FaStore}        label="Brand"    value={brand} />
                      <StatPill icon={FaStar}         label="Rating"   value={`${Math.round(rating)} / 5`} />
                      <StatPill icon={FaStar}         label="Reviews"  value={numReviews} />
                      <StatPill icon={FaClock}        label="Added"    value={moment(createdAt).fromNow()} />
                      <StatPill icon={FaShoppingCart} label="Qty"      value={quantity} />
                      <StatPill icon={FaBox}          label="In Stock" value={countInStock} />
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;