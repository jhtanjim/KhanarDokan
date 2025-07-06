import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../../Provider/AuthProvider";
import useAxios from "../../hooks/useAxios";

// Initialize Stripe
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51RgguW03Ub5mHSNCVmIVZ54oALpf2tuAKmRkbhihboGTO89Pi9VilfKRSMiFw6oZVPscoL3aQqWsskZTGVEJvbQn00NEVIQsQW"
);

// Payment method constants
const PAYMENT_METHODS = {
  CARD: "card",
  BKASH: "bkash",
  NAGAD: "nagad",
};

const CheckoutForm = ({ cart, totalPrice, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxios();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    PAYMENT_METHODS.CARD
  );
  const [phoneNumber, setPhoneNumber] = useState("");

  // Handle card payment (existing logic)
  const handleCardPayment = async (cardElement) => {
    const { data } = await axiosSecure.post("/create-payment-intent", {
      amount: Math.round(totalPrice * 100),
      currency: "usd",
      cart: cart,
    });

    if (!data.clientSecret) {
      throw new Error("Failed to create payment intent");
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      data.clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || "Anonymous",
            email: user?.email || "anonymous@example.com",
          },
        },
      }
    );

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === "succeeded") {
      return {
        paymentIntentId: paymentIntent.id,
        status: "succeeded",
      };
    }
  };

  // Handle bKash payment
  const handleBkashPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      throw new Error("Please enter a valid bKash phone number");
    }

    // Call your backend to initiate bKash payment
    const { data } = await axiosSecure.post("/bkash/create-payment", {
      amount: totalPrice,
      currency: "BDT",
      phone: phoneNumber,
      cart: cart,
      userEmail: user.email,
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to initiate bKash payment");
    }

    // Redirect to bKash payment page or handle the response
    if (data.bkashURL) {
      window.location.href = data.bkashURL;
    } else {
      // Handle in-app payment flow
      return {
        paymentIntentId: data.paymentID,
        status: "succeeded",
      };
    }
  };

  // Handle Nagad payment
  const handleNagadPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 11) {
      throw new Error("Please enter a valid Nagad phone number");
    }

    // Call your backend to initiate Nagad payment
    const { data } = await axiosSecure.post("/nagad/create-payment", {
      amount: totalPrice,
      currency: "BDT",
      phone: phoneNumber,
      cart: cart,
      userEmail: user.email,
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to initiate Nagad payment");
    }

    // Redirect to Nagad payment page or handle the response
    if (data.nagadURL) {
      window.location.href = data.nagadURL;
    } else {
      // Handle in-app payment flow
      return {
        paymentIntentId: data.paymentID,
        status: "succeeded",
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      selectedPaymentMethod === PAYMENT_METHODS.CARD &&
      (!stripe || !elements)
    ) {
      setPaymentError("Stripe has not loaded yet. Please try again.");
      return;
    }

    setProcessing(true);
    setPaymentError("");

    try {
      let paymentResult;

      switch (selectedPaymentMethod) {
        case PAYMENT_METHODS.CARD:
          const cardElement = elements.getElement(CardElement);
          if (!cardElement) {
            throw new Error(
              "Card element not found. Please refresh and try again."
            );
          }
          paymentResult = await handleCardPayment(cardElement);
          break;

        case PAYMENT_METHODS.BKASH:
          paymentResult = await handleBkashPayment();
          break;

        case PAYMENT_METHODS.NAGAD:
          paymentResult = await handleNagadPayment();
          break;

        default:
          throw new Error("Invalid payment method selected");
      }

      // If payment was successful, create order
      if (paymentResult && paymentResult.status === "succeeded") {
        const orderData = {
          email: user.email,
          userName: user.displayName,
          items: cart,
          totalPrice: totalPrice,
          paymentIntentId: paymentResult.paymentIntentId,
          paymentMethod: selectedPaymentMethod,
          phoneNumber:
            selectedPaymentMethod !== PAYMENT_METHODS.CARD ? phoneNumber : null,
          status: "paid",
          orderDate: new Date(),
          deliveryStatus: "pending",
        };

        const orderResult = await axiosSecure.post("/orders", orderData);

        if (orderResult.data.insertedId) {
          await axiosSecure.delete(`/carts?email=${user.email}`);

          Swal.fire({
            title: "Payment Successful!",
            text: "Your order has been placed successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });

          onPaymentSuccess();
        }
      }
    } catch (error) {
      setPaymentError(error.message || "Payment failed. Please try again.");
      console.error("Payment error:", error);
    }

    setProcessing(false);
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError("");
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setPaymentError("");
    setPhoneNumber("");
  };

  const validatePhoneNumber = (phone) => {
    const bdPhoneRegex = /^(\+88|88)?(01[3-9]\d{8})$/;
    return bdPhoneRegex.test(phone);
  };

  const isFormValid = () => {
    switch (selectedPaymentMethod) {
      case PAYMENT_METHODS.CARD:
        return stripe && cardComplete;
      case PAYMENT_METHODS.BKASH:
      case PAYMENT_METHODS.NAGAD:
        return validatePhoneNumber(phoneNumber);
      default:
        return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Billing Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Billing Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              defaultValue={user?.displayName?.split(" ")[0] || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              defaultValue={user?.displayName?.split(" ")[1] || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg
            className="w-5 h-5 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Payment Method
        </h3>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Card Payment */}
          <button
            type="button"
            onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.CARD)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedPaymentMethod === PAYMENT_METHODS.CARD
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="font-medium">Card</span>
              <div className="flex space-x-1">
                <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  V
                </div>
                <div className="w-6 h-4 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  M
                </div>
              </div>
            </div>
          </button>

          {/* bKash Payment */}
          <button
            type="button"
            onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.BKASH)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedPaymentMethod === PAYMENT_METHODS.BKASH
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                b
              </div>
              <span className="font-medium">bKash</span>
              <span className="text-xs text-gray-500">Mobile Banking</span>
            </div>
          </button>

          {/* Nagad Payment */}
          <button
            type="button"
            onClick={() => handlePaymentMethodChange(PAYMENT_METHODS.NAGAD)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedPaymentMethod === PAYMENT_METHODS.NAGAD
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                N
              </div>
              <span className="font-medium">Nagad</span>
              <span className="text-xs text-gray-500">Mobile Banking</span>
            </div>
          </button>
        </div>

        {/* Payment Form Based on Selection */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border-2 border-gray-200">
          {selectedPaymentMethod === PAYMENT_METHODS.CARD && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <div className="bg-white border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all w-full min-h-[44px]">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#1f2937",
                          fontFamily:
                            '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                          fontWeight: "400",
                          lineHeight: "1.5",
                          "::placeholder": { color: "#9ca3af" },
                          iconColor: "#6b7280",
                        },
                        invalid: { color: "#ef4444", iconColor: "#ef4444" },
                        complete: { color: "#059669", iconColor: "#059669" },
                      },
                      hidePostalCode: false,
                    }}
                    onChange={handleCardChange}
                  />
                </div>
              </div>
            </div>
          )}

          {(selectedPaymentMethod === PAYMENT_METHODS.BKASH ||
            selectedPaymentMethod === PAYMENT_METHODS.NAGAD) && (
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedPaymentMethod === PAYMENT_METHODS.BKASH
                  ? "bKash"
                  : "Nagad"}{" "}
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 text-sm">+88</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your{" "}
                {selectedPaymentMethod === PAYMENT_METHODS.BKASH
                  ? "bKash"
                  : "Nagad"}{" "}
                registered mobile number
              </p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <svg
              className="w-4 h-4 mr-1 text-green-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Your payment information is encrypted and secure
          </div>
        </div>
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div className="text-sm text-red-700 break-words">
              {paymentError}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={processing || !isFormValid()}
        className={`w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 flex items-center justify-center ${
          processing || !isFormValid()
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        }`}
      >
        {processing ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="break-words">
              Pay with{" "}
              {selectedPaymentMethod === PAYMENT_METHODS.CARD
                ? "Card"
                : selectedPaymentMethod === PAYMENT_METHODS.BKASH
                ? "bKash"
                : "Nagad"}{" "}
              -
              {selectedPaymentMethod === PAYMENT_METHODS.CARD
                ? ` $${totalPrice.toFixed(2)}`
                : ` ৳${(totalPrice * 110).toFixed(2)}`}
            </span>
          </>
        )}
      </button>

      {/* Trust Indicators */}
      <div className="text-center">
        <div className="text-xs text-gray-500 mb-2">
          Protected by 256-bit SSL encryption
        </div>
        <div className="flex flex-wrap justify-center items-center space-x-2 sm:space-x-4 text-xs text-gray-400">
          <span>🔒 SSL Secured</span>
          <span className="hidden sm:inline">•</span>
          <span>💳 PCI Compliant</span>
          <span className="hidden sm:inline">•</span>
          <span>🛡️ Fraud Protection</span>
        </div>
      </div>
    </form>
  );
};

const Payment = ({ cart, totalPrice, onPaymentSuccess, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Secure Checkout
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete your purchase securely
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col xl:flex-row xl:gap-8">
            {/* Order Summary */}
            <div className="w-full xl:w-2/5 mb-8 xl:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/48x48?text=No+Image";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">Qty: 1</div>
                        </div>
                      </div>
                      <div className="font-semibold text-sm flex-shrink-0">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ≈ ৳{(totalPrice * 110).toFixed(2)} BDT
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="w-full xl:w-3/5">
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  cart={cart}
                  totalPrice={totalPrice}
                  onPaymentSuccess={onPaymentSuccess}
                />
              </Elements>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
