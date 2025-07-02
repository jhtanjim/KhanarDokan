import { CreditCard, Trash } from "lucide-react";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import useCart from "../../hooks/useCart";
import { AuthContext } from "../../Provider/AuthProvider";
import Payment from "./Payment"; // Import the Payment component

const Cart = () => {
  const [cart, refetch] = useCart();
  const { user } = useContext(AuthContext);
  const [showPayment, setShowPayment] = useState(false);
  const axiosSecure = useAxios();

  const totalPrice = cart.reduce((total, item) => total + item.price, 0);

  const handlePayment = () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Cart is empty!",
        text: "Please add items to your cart before proceeding to payment.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    refetch(); // Refresh cart after successful payment

    // Optional: Redirect to order history
    // navigate('/order-history');
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
  };

  const handleDeleteAll = () => {
    if (cart.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This will delete all items in your cart!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/carts?email=${user.email}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire(
                "Deleted!",
                "All items have been removed from your cart.",
                "success"
              );
            }
          })
          .catch((error) => {
            console.error("Error deleting cart items:", error);
            Swal.fire("Error!", "Failed to delete cart items.", "error");
          });
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/carts/${id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "Item has been removed from your cart.",
                icon: "success",
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting cart item:", error);
            Swal.fire("Error!", "Failed to delete item.", "error");
          });
      }
    });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
            <p className="text-blue-100 mt-1">
              {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="bg-gray-50 px-6 py-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                Total Items:{" "}
                <span className="font-semibold">{cart.length}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-2xl font-bold text-gray-900">
                  Total:{" "}
                  <span className="text-green-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={cart.length === 0}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all duration-200 shadow-lg transform ${
                    cart.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:-translate-y-0.5"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay Now - ${totalPrice.toFixed(2)}
                </button>

                <button
                  onClick={handleDeleteAll}
                  disabled={cart.length === 0}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 shadow ${
                    cart.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                >
                  <Trash className="w-4 h-4 mr-1" />
                  Delete All
                </button>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500">
                Add some delicious items to get started!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded-lg object-cover shadow-sm"
                            src={item.image}
                            alt={item.name}
                            onError={(e) => {
                              if (
                                e.currentTarget.src !==
                                "https://placehold.co/64x64?text=No+Image"
                              ) {
                                e.currentTarget.src =
                                  "https://placehold.co/64x64?text=No+Image";
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {item.menuId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-semibold text-green-600">
                          ${item.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700">
                          {item.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <Payment
          cart={cart}
          totalPrice={totalPrice}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      )}
    </>
  );
};

export default Cart;
