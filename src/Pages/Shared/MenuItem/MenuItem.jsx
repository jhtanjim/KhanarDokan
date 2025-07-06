import { Flame, Heart, ShoppingCart, Star, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
import { useShop } from "../../../Provider/ShopProvider";

const MenuItem = ({ item }) => {
  const { name, recipe, image, category, price, _id } = item;
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // Use shop context for favorites and cart management
  const {
    toggleFavorite,
    isFavorite,
    addToCart: addToCartContext,
    isInCart,
    getCartItemQuantity,
  } = useShop();

  // Check if item is favorite
  const isItemFavorite = isFavorite(_id);
  const itemQuantity = getCartItemQuantity(_id);

  // Handle favorite toggle
  const handleToggleFavorite = () => {
    if (user && user.email) {
      toggleFavorite(item);
    } else {
      Swal.fire({
        title: "Please Login",
        text: "You need to log in to add items to favorites.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  // Add to cart function (for database)
  const handleAddToCart = async (item) => {
    if (user && user.email) {
      try {
        // Add to database
        const cartItem = {
          menuId: _id,
          email: user.email,
          image,
          price,
          name,
        };

        const res = await axiosSecure.post("/carts", cartItem);

        if (res.data.insertedId) {
          // Add to context state
          addToCartContext(item);
        }
      } catch (err) {
        console.error("Add to cart error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Please try again later.",
        });
      }
    } else {
      Swal.fire({
        title: "Please Login",
        text: "You need to log in to add items to your cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login Now",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
  };

  return (
    <div className="group relative w-full mx-auto  bg-white rounded-2xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl h-full flex flex-col">
      {/* Category Badge */}
      <div className="absolute top-4 left-4 bg-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center z-20">
        <Tag className="w-4 h-4 mr-1" />
        {category}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className={`absolute top-4 right-4 z-20 rounded-full p-2 backdrop-blur-sm transition-all duration-300 ${
          isItemFavorite
            ? "bg-red-500 hover:bg-red-600"
            : "bg-white/20 hover:bg-white/40"
        }`}
      >
        <Heart
          className={`w-5 h-5 stroke-2 ${
            isItemFavorite
              ? "text-white fill-white"
              : "text-gray-600 hover:text-red-500"
          }`}
        />
      </button>

      {/* Quantity Badge (if in cart) */}
      {itemQuantity > 0 && (
        <div className="absolute top-4 right-16 z-20 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
          {itemQuantity}
        </div>
      )}

      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <div className="flex items-center text-yellow-500 mt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm text-gray-600">4.5</span>
              </div>
            </div>
            <span className="text-lg font-bold text-primary flex items-center">
              <Flame className="w-5 h-5 mr-1 text-orange-500" />$
              {price.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{recipe}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-auto pt-3">
          <button
            onClick={() => handleAddToCart(item)}
            className={`flex items-center py-2 px-4 rounded-full text-sm font-medium transition duration-300 ${
              isInCart(_id)
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isInCart(_id) ? "In Cart" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
