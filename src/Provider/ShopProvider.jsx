import { createContext, useContext, useReducer } from "react";
import Swal from "sweetalert2";

// Create Context
const ShopContext = createContext();

// Action Types
const SHOP_ACTIONS = {
  ADD_TO_FAVORITES: "ADD_TO_FAVORITES",
  REMOVE_FROM_FAVORITES: "REMOVE_FROM_FAVORITES",
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",
  CLEAR_FAVORITES: "CLEAR_FAVORITES",
  ADD_TO_CART: "ADD_TO_CART",
  REMOVE_FROM_CART: "REMOVE_FROM_CART",
  CLEAR_CART: "CLEAR_CART",
  UPDATE_CART_QUANTITY: "UPDATE_CART_QUANTITY",
};

// Initial State
const initialState = {
  favorites: [],
  cart: [],
  favoriteCount: 0,
  cartCount: 0,
};

// Reducer Function
const shopReducer = (state, action) => {
  switch (action.type) {
    case SHOP_ACTIONS.ADD_TO_FAVORITES:
      const newFavorite = action.payload;
      const existingFavorite = state.favorites.find(
        (item) => item._id === newFavorite._id
      );

      if (existingFavorite) {
        return state; // Already in favorites
      }

      return {
        ...state,
        favorites: [...state.favorites, newFavorite],
        favoriteCount: state.favoriteCount + 1,
      };

    case SHOP_ACTIONS.REMOVE_FROM_FAVORITES:
      const filteredFavorites = state.favorites.filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        favorites: filteredFavorites,
        favoriteCount: filteredFavorites.length,
      };

    case SHOP_ACTIONS.TOGGLE_FAVORITE:
      const item = action.payload;
      const isFavorite = state.favorites.some((fav) => fav._id === item._id);

      if (isFavorite) {
        const updatedFavorites = state.favorites.filter(
          (fav) => fav._id !== item._id
        );
        return {
          ...state,
          favorites: updatedFavorites,
          favoriteCount: updatedFavorites.length,
        };
      } else {
        return {
          ...state,
          favorites: [...state.favorites, item],
          favoriteCount: state.favoriteCount + 1,
        };
      }

    case SHOP_ACTIONS.CLEAR_FAVORITES:
      return {
        ...state,
        favorites: [],
        favoriteCount: 0,
      };

    case SHOP_ACTIONS.ADD_TO_CART:
      const cartItem = action.payload;
      const existingCartItem = state.cart.find(
        (item) => item._id === cartItem._id
      );

      if (existingCartItem) {
        const updatedCart = state.cart.map((item) =>
          item._id === cartItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          cart: updatedCart,
          cartCount: updatedCart.reduce(
            (total, item) => total + item.quantity,
            0
          ),
        };
      } else {
        const newCart = [...state.cart, { ...cartItem, quantity: 1 }];
        return {
          ...state,
          cart: newCart,
          cartCount: newCart.reduce((total, item) => total + item.quantity, 0),
        };
      }

    case SHOP_ACTIONS.REMOVE_FROM_CART:
      const filteredCart = state.cart.filter(
        (item) => item._id !== action.payload
      );
      return {
        ...state,
        cart: filteredCart,
        cartCount: filteredCart.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };

    case SHOP_ACTIONS.UPDATE_CART_QUANTITY:
      const { itemId, quantity } = action.payload;
      const updatedCartItems = state.cart.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
      return {
        ...state,
        cart: updatedCartItems,
        cartCount: updatedCartItems.reduce(
          (total, item) => total + item.quantity,
          0
        ),
      };

    case SHOP_ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: [],
        cartCount: 0,
      };

    default:
      return state;
  }
};

// Shop Provider Component
export const ShopProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shopReducer, initialState);

  // Favorite Actions
  const addToFavorites = (item) => {
    dispatch({ type: SHOP_ACTIONS.ADD_TO_FAVORITES, payload: item });
    Swal.fire({
      icon: "success",
      title: "Added to Favorites!",
      text: `${item.name} has been added to your favorites!`,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: "top-end",
    });
  };

  const removeFromFavorites = (itemId) => {
    const item = state.favorites.find((fav) => fav._id === itemId);
    dispatch({ type: SHOP_ACTIONS.REMOVE_FROM_FAVORITES, payload: itemId });
    Swal.fire({
      icon: "info",
      title: "Removed from Favorites",
      text: `${item?.name} has been removed from your favorites.`,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: "top-end",
    });
  };

  const toggleFavorite = (item) => {
    const isFavorite = state.favorites.some((fav) => fav._id === item._id);
    dispatch({ type: SHOP_ACTIONS.TOGGLE_FAVORITE, payload: item });

    if (isFavorite) {
      Swal.fire({
        icon: "info",
        title: "Removed from Favorites",
        text: `${item.name} has been removed from your favorites.`,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-end",
      });
    } else {
      Swal.fire({
        icon: "success",
        title: "Added to Favorites!",
        text: `${item.name} has been added to your favorites!`,
        showConfirmButton: false,
        timer: 2000,
        toast: true,
        position: "top-end",
      });
    }
  };

  const clearFavorites = () => {
    Swal.fire({
      title: "Clear All Favorites?",
      text: "Are you sure you want to remove all items from your favorites?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear all!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: SHOP_ACTIONS.CLEAR_FAVORITES });
        Swal.fire({
          icon: "success",
          title: "Favorites Cleared!",
          text: "All items have been removed from your favorites.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top-end",
        });
      }
    });
  };

  // Cart Actions
  const addToCart = (item) => {
    dispatch({ type: SHOP_ACTIONS.ADD_TO_CART, payload: item });
    Swal.fire({
      icon: "success",
      title: "Added to Cart!",
      text: `${item.name} has been added to your cart!`,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: "top-end",
    });
  };

  const removeFromCart = (itemId) => {
    const item = state.cart.find((cartItem) => cartItem._id === itemId);
    dispatch({ type: SHOP_ACTIONS.REMOVE_FROM_CART, payload: itemId });
    Swal.fire({
      icon: "info",
      title: "Removed from Cart",
      text: `${item?.name} has been removed from your cart.`,
      showConfirmButton: false,
      timer: 2000,
      toast: true,
      position: "top-end",
    });
  };

  const updateCartQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      dispatch({
        type: SHOP_ACTIONS.UPDATE_CART_QUANTITY,
        payload: { itemId, quantity },
      });
    }
  };

  const clearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items from your cart?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, clear cart!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch({ type: SHOP_ACTIONS.CLEAR_CART });
        Swal.fire({
          icon: "success",
          title: "Cart Cleared!",
          text: "All items have been removed from your cart.",
          showConfirmButton: false,
          timer: 2000,
          toast: true,
          position: "top-end",
        });
      }
    });
  };

  // Helper Functions
  const isFavorite = (itemId) => {
    return state.favorites.some((fav) => fav._id === itemId);
  };

  const isInCart = (itemId) => {
    return state.cart.some((cartItem) => cartItem._id === itemId);
  };

  const getCartItemQuantity = (itemId) => {
    const cartItem = state.cart.find((item) => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const getCartTotal = () => {
    return state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const value = {
    // State
    favorites: state.favorites,
    cart: state.cart,
    favoriteCount: state.favoriteCount,
    cartCount: state.cartCount,

    // Favorite Actions
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,

    // Cart Actions
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    // Helper Functions
    isFavorite,
    isInCart,
    getCartItemQuantity,
    getCartTotal,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

// Custom Hook to use Shop Context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
};

export default ShopProvider;
