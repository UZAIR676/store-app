import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
    />
  </div>
);

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !price || !category || !quantity || !brand) {
      toast.error("Please fill all fields");
      return;
    }

    if (!image) {
      toast.error("Please upload an image");
      return;
    }

    try {
      const productData = {
        image,
        name,
        description,
        price,
        category,
        quantity,
        brand,
        countInStock: stock,
      };

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(`${data.name} created successfully!`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded!");
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />
      <div className="xl:ml-16 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-pink-500 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-white">Create Product</h1>
              <p className="text-gray-500 text-sm mt-0.5">Add a new product to your store</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
            {/* Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Product Image</label>
              <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-xl cursor-pointer transition-colors overflow-hidden" style={{ minHeight: "160px" }}>
                {imageUrl ? (
                  <img src={imageUrl} alt="preview" className="w-full max-h-48 object-contain rounded-xl" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 text-gray-600">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm">Click to upload image</span>
                  </div>
                )}
                <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} className="hidden" />
              </label>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
              <InputField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
              <InputField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
              <InputField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" />
              <InputField label="Count In Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />

              {/* Category */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Category</label>
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-bold rounded-full py-3 text-sm hover:shadow-lg hover:shadow-pink-900/40 mt-2"
            >
              Create Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;