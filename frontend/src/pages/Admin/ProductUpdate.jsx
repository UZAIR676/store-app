import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

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

const AdminProductUpdate = () => {
  const params = useParams();
  const { data: productData } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();
  const { data: categories = [] } = useFetchCategoriesQuery();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData?._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setCategory(productData.category?._id);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock);
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded!");
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Fix: send plain JSON, not FormData
      const formData = { image, name, description, price, category, quantity, brand, countInStock: stock };
      const data = await updateProduct({ productId: params._id, formData });
      if (data?.error) {
        toast.error("Update failed");
      } else {
        toast.success("Product updated successfully!");
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      toast.error("Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { data } = await deleteProduct(params._id);
      toast.success(`"${data.name}" deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Delete failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminMenu />
      <div className="xl:ml-16 px-6 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-pink-500 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-white">Update Product</h1>
              <p className="text-gray-500 text-sm mt-0.5">Edit or delete this product</p>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col gap-5">
            {/* Image Upload */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Product Image</label>
              <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-700 hover:border-pink-500 rounded-xl cursor-pointer transition-colors overflow-hidden" style={{ minHeight: "160px" }}>
                {image ? (
                  <img src={image} alt="preview" className="w-full max-h-48 object-contain rounded-xl" />
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
              <InputField label="Product Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
              <InputField label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" />
              <InputField label="Quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" />
              <InputField label="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" />
              <InputField label="Count In Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="0" />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Category</label>
                <select
                  className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category || ""}
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
                placeholder="Product description..."
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-500 transition-colors resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-pink-600 hover:bg-pink-500 transition-all duration-300 text-white font-bold rounded-full py-3 text-sm hover:shadow-lg hover:shadow-pink-900/40"
              >
                Update Product
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 font-bold rounded-full py-3 text-sm transition-all duration-200"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;