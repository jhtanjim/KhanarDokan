import { Grid, Heart, List, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import bannerImg from "../../../src/assets/contact/banner.jpg";
import FoodCart from "../../Component/FoodCart/FoodCart";
import { useShop } from "../../Provider/ShopProvider";
import Cover from "../Shared/Cover/Cover";

const Favorites = () => {
  const {
    favorites,
    favoriteCount,
    clearFavorites,
    removeFromFavorites,
    addToCart,
  } = useShop();

  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map((item) => item._id));
    }
  };

  // Handle individual item selection
  const handleItemSelect = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle bulk actions
  const handleBulkRemove = () => {
    if (selectedItems.length === 0) return;

    selectedItems.forEach((itemId) => {
      removeFromFavorites(itemId);
    });
    setSelectedItems([]);
  };

  const handleBulkAddToCart = () => {
    if (selectedItems.length === 0) return;

    const selectedFavorites = favorites.filter((item) =>
      selectedItems.includes(item._id)
    );
    selectedFavorites.forEach((item) => {
      addToCart(item);
    });
    setSelectedItems([]);
  };

  if (favorites.length === 0) {
    return (
      <div>
        <Cover
          title="Your Favorites"
          subtitle="Your favorite food items will appear here"
          img={bannerImg}
          height="300px"
        />

        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Start adding items to your favorites by clicking the heart icon on
              any food item.
            </p>
            <a
              href="/order"
              className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition duration-300"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Browse Menu
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Cover
        title="Your Favorites"
        subtitle={`You have ${favoriteCount} favorite ${
          favoriteCount === 1 ? "item" : "items"
        }`}
        img={bannerImg}
        height="300px"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center px-4 py-2 rounded-full transition duration-300 ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center px-4 py-2 rounded-full transition duration-300 ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              <List className="w-4 h-4 mr-2" />
              List View
            </button>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedItems.length === favorites.length}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span className="text-sm">Select All</span>
            </label>

            {selectedItems.length > 0 && (
              <>
                <button
                  onClick={handleBulkAddToCart}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart ({selectedItems.length})
                </button>
                <button
                  onClick={handleBulkRemove}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove ({selectedItems.length})
                </button>
              </>
            )}

            <button
              onClick={clearFavorites}
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-full hover:bg-gray-600 transition duration-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>

        {/* Favorites Grid/List */}
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }`}
        >
          {favorites.map((item) => (
            <div key={item._id} className="relative">
              {/* Selection checkbox */}
              <div className="absolute top-2 left-2 z-30">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleItemSelect(item._id)}
                  className="w-5 h-5 rounded border-2 border-white shadow-lg"
                />
              </div>

              <FoodCart item={item} view={viewMode} />
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Favorites Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {favoriteCount}
              </div>
              <div className="text-gray-600">Total Favorites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {favorites
                  .reduce((total, item) => total + item.price, 0)
                  .toFixed(2)}
              </div>
              <div className="text-gray-600">Total Value ($)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {[...new Set(favorites.map((item) => item.category))].length}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
