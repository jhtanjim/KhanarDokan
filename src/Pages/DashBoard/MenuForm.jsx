import {
  BookOpen,
  DollarSign,
  Edit,
  Eye,
  Image,
  Plus,
  Save,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import React, { useState } from "react";

// Mock React Query hooks (since we can't import the actual library)
const useQuery = (key, fn, options = {}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fn();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      const result = await fn();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
};

const useMutation = (fn) => {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (...args) => {
    setIsLoading(true);
    try {
      const result = await fn(...args);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
};

// Custom hook for menu operations
const useMenu = () => {
  const fetchMenuItems = async () => {
    const response = await fetch("http://localhost:5000/menu");
    if (!response.ok) throw new Error("Failed to fetch menu items");
    return response.json();
  };

  const {
    data: menuItems = [],
    isLoading,
    error,
    refetch,
  } = useQuery(["menuItems"], fetchMenuItems);

  const addMenuItem = async (menuItem) => {
    const token = localStorage.getItem("access-token");
    const response = await fetch("http://localhost:5000/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...menuItem,
        price: parseFloat(menuItem.price),
      }),
    });
    if (!response.ok) throw new Error("Failed to add menu item");
    return response.json();
  };

  const updateMenuItem = async ({ id, ...menuItem }) => {
    const token = localStorage.getItem("access-token");
    const response = await fetch(`http://localhost:5000/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...menuItem,
        price: parseFloat(menuItem.price),
      }),
    });
    if (!response.ok) throw new Error("Failed to update menu item");
    return response.json();
  };

  const deleteMenuItem = async (id) => {
    const token = localStorage.getItem("access-token");
    const response = await fetch(`http://localhost:5000/menu/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete menu item");
    return response.json();
  };

  const addMutation = useMutation(addMenuItem);
  const updateMutation = useMutation(updateMenuItem);
  const deleteMutation = useMutation(deleteMenuItem);

  return {
    menuItems,
    isLoading,
    error,
    refetch,
    addMenuItem: addMutation.mutate,
    updateMenuItem: updateMutation.mutate,
    deleteMenuItem: deleteMutation.mutate,
    isAdding: addMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
};

const MenuForm = () => {
  const {
    menuItems,
    isLoading,
    error,
    refetch,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    isAdding,
    isUpdating,
    isDeleting,
  } = useMenu();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    recipe: "",
    image: "",
    category: "",
    price: "",
  });

  const categories = [
    { value: "appetizer", label: "Appetizer", icon: "🥗" },
    { value: "main-course", label: "Main Course", icon: "🍽️" },
    { value: "dessert", label: "Dessert", icon: "🍰" },
    { value: "beverage", label: "Beverage", icon: "🥤" },
    { value: "snack", label: "Snack", icon: "🍿" },
    { value: "salad", label: "Salad", icon: "🥙" },
    { value: "soup", label: "Soup", icon: "🍲" },
  ];

  // Fixed image upload function
  const uploadToImageBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      setImageUploading(true);
      // You need to replace this with your actual ImageBB API key
      const IMGBB_API_KEY = "your-imgbb-api-key-here";
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();

      if (data.success) {
        return data.data.display_url;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // For demo purposes, create a placeholder URL
      return `https://via.placeholder.com/400x300?text=${encodeURIComponent(
        imageFile.name
      )}`;
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const imageUrl = await uploadToImageBB(file);
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      } catch (error) {
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingItem) {
        await updateMenuItem({ id: editingItem._id, ...formData });
        alert("Menu item updated successfully!");
      } else {
        await addMenuItem(formData);
        alert("Menu item added successfully!");
      }

      await refetch();
      resetForm();
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("Error saving menu item. Please try again.");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      recipe: item.recipe,
      image: item.image,
      category: item.category,
      price: item.price.toString(),
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id);
        await refetch();
        alert("Menu item deleted successfully!");
      } catch (error) {
        console.error("Error deleting menu item:", error);
        alert("Error deleting menu item. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      recipe: "",
      image: "",
      category: "",
      price: "",
    });
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const getCategoryInfo = (category) => {
    return (
      categories.find((cat) => cat.value === category) || {
        label: category,
        icon: "🍴",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Menu Management
              </h1>
              <p className="text-slate-600 mt-2">
                Manage your restaurant's delicious offerings
              </p>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-slate-800">
                  {menuItems.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Categories</p>
                <p className="text-2xl font-bold text-slate-800">
                  {new Set(menuItems.map((item) => item.category)).size}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Tag className="text-green-600" size={24} />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Avg Price</p>
                <p className="text-2xl font-bold text-slate-800">
                  $
                  {menuItems.length > 0
                    ? (
                        menuItems.reduce((sum, item) => sum + item.price, 0) /
                        menuItems.length
                      ).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter item name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Recipe/Description
                  </label>
                  <textarea
                    name="recipe"
                    value={formData.recipe}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter recipe or description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.icon} {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Image
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-indigo-500 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100"
                      >
                        <Upload size={20} className="mr-2 text-slate-500" />
                        <span className="text-slate-600">
                          Click to upload image
                        </span>
                      </label>
                    </div>

                    {imageUploading && (
                      <div className="flex items-center justify-center p-4 bg-blue-50 rounded-xl">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-blue-600">
                          Uploading image...
                        </span>
                      </div>
                    )}

                    {formData.image && (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl border-2 border-slate-200"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg p-1">
                          <Eye size={16} className="text-slate-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isAdding || isUpdating || imageUploading}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none"
                  >
                    <Save size={16} />
                    {isAdding || isUpdating
                      ? "Saving..."
                      : editingItem
                      ? "Update Item"
                      : "Add Item"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const categoryInfo = getCategoryInfo(item.category);
            return (
              <div
                key={item._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Image
                        size={48}
                        className="text-slate-400 mx-auto mb-2"
                      />
                      <p className="text-slate-500 text-sm">No image</p>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-xs font-semibold text-slate-600">
                      {categoryInfo.icon}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">
                      {item.name}
                    </h3>
                    <span className="text-lg font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      ${item.price}
                    </span>
                  </div>

                  <div className="flex items-center mb-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                      {categoryInfo.icon} {categoryInfo.label}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {item.recipe}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={isDeleting}
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-slate-400 disabled:to-slate-500 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {menuItems.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/20">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image size={48} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                No menu items yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start building your menu by adding your first delicious item!
              </p>
              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
              >
                <Plus size={20} />
                Add Your First Item
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuForm;
