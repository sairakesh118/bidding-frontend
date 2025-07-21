import React, { useState } from "react";
import axios from "axios";
import { useCreateItemMutation } from "../redux/features/items/itemSlice";
import { useSelector } from "react-redux";
import { Upload, Image, Clock, DollarSign, Tag, FileText, User } from "lucide-react";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/sairakesh/upload";
const CLOUDINARY_UPLOAD_PRESET = "rakeshpostpreset";

const CATEGORIES = [
  { value: "", label: "Select Category" },
  { value: "art", label: "🎨 Art & Paintings" },
  { value: "music", label: "🎵 Music & Instruments" },
  { value: "jewelry", label: "💎 Jewelry & Watches" },
  { value: "electronics", label: "📱 Electronics" },
  { value: "collectibles", label: "🏆 Collectibles" },
  { value: "antiques", label: "🏺 Antiques" },
  { value: "books", label: "📚 Books & Manuscripts" },
  { value: "sports", label: "⚽ Sports Memorabilia" },
  { value: "fashion", label: "👗 Fashion & Accessories" },
  { value: "home", label: "🏠 Home & Garden" },
  { value: "automotive", label: "🚗 Automotive" },
  { value: "other", label: "📦 Other" }
];

const BidPostForm = () => {
  const id = useSelector((state) => state.auth.user.id);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    starting_price: "",
    current_bid: "",
    end_time: "",
    owner_id: id,
    winner_id: "",
    image_url: "",
    category: "",
  });

  const [createItem, { isLoading }] = useCreateItemMutation();
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    setUploading(true);
    setErrors(prev => ({ ...prev, image: "" }));
    
    try {
      const res = await axios.post(CLOUDINARY_URL, data);
      const imageUrl = res.data.secure_url;
      setFormData((prev) => ({
        ...prev,
        image_url: imageUrl,
      }));
    } catch (err) {
      console.error("Upload failed:", err);
      setErrors(prev => ({ ...prev, image: "Image upload failed. Please try again." }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.starting_price || formData.starting_price <= 0) newErrors.starting_price = "Valid starting price is required";
    if (!formData.end_time) newErrors.end_time = "End time is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image_url) newErrors.image = "Image is required";
    
    // Check if end time is in the future
    if (formData.end_time && new Date(formData.end_time) <= new Date()) {
      newErrors.end_time = "End time must be in the future";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const dataToSend = {
      ...formData,
      starting_price: parseFloat(formData.starting_price),
      current_bid: parseFloat(formData.starting_price), // Initialize current_bid with starting_price
      end_time: new Date(formData.end_time).toISOString(),
    };
    print("Submitting data:", dataToSend);

    try {
      await createItem(dataToSend).unwrap();
      // Reset form on success
      setFormData({
        name: "",
        description: "",
        starting_price: "",
        current_bid: "",
        end_time: "",
        owner_id: id,
        winner_id: "",
        image_url: "",
        category: "",
      });
      alert("Auction item posted successfully!");
    } catch (error) {
      console.error("Failed to create item:", error);
      alert("Failed to post auction item. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 px-8 py-12 text-white">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                <Tag className="w-10 h-10" />
              </div>
              <h1 className="text-4xl font-bold mb-2">Post Auction Item</h1>
              <p className="text-purple-100 text-lg">Create your auction listing and start bidding</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Item Name */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter item name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <Tag className="w-4 h-4 mr-2" />
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.category ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {/* Starting Price */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Starting Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-gray-500">$</span>
                    <input
                      type="number"
                      name="starting_price"
                      value={formData.starting_price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className={`w-full pl-8 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.starting_price ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.starting_price && <p className="text-red-500 text-sm mt-1">{errors.starting_price}</p>}
                </div>

                {/* End Time */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    Auction End Time
                  </label>
                  <input
                    type="datetime-local"
                    name="end_time"
                    value={formData.end_time}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.end_time ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <FileText className="w-4 h-4 mr-2" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Describe your item in detail..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="flex items-center text-gray-700 font-semibold mb-2">
                    <Image className="w-4 h-4 mr-2" />
                    Item Image
                  </label>
                  
                  {!formData.image_url ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <span className="text-purple-600 font-semibold hover:text-purple-700">
                              Click to upload image
                            </span>
                          </label>
                          <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Uploaded item"
                        className="w-full h-64 object-cover rounded-xl border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {uploading && (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                      <span className="ml-2 text-purple-600">Uploading image...</span>
                    </div>
                  )}
                  
                  {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                disabled={isLoading || uploading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Posting...
                  </div>
                ) : (
                  "Post Auction Item"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BidPostForm;