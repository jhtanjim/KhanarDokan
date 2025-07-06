import { useState } from "react";
import BkashPayment from "./BkashPayment";
import NagadPayment from "./NagadPayment";

const PaymentMethodSelector = ({
  cart = [], // Default to empty array
  totalPrice = 0, // Default to 0
  onPaymentSuccess,
  onCancel,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "stripe",
      name: "Credit/Debit Card",
      description: "Pay with Visa, Mastercard, or American Express",
      icon: "💳",
      color: "blue",
      available: true,
    },
    {
      id: "bkash",
      name: "bKash",
      description: "Pay with your bKash account",
      icon: "🏦",
      color: "pink",
      available: true,
    },
    {
      id: "nagad",
      name: "Nagad",
      description: "Pay with your Nagad account",
      icon: "📱",
      color: "orange",
      available: true,
    },
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleBackToSelection = () => {
    setSelectedMethod(null);
  };

  // Early return if cart is empty or undefined
  if (!cart || cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-md p-6">
          <div className="text-center">
            <div className="text-gray-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.68 2.39a1 1 0 001.68 1.11L9 15h9.8a1 1 0 00.95-.69L21 9H7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-4">
              Please add items to your cart before proceeding to checkout.
            </p>
            <button
              onClick={onCancel}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render specific payment component based on selected method
  const renderPaymentComponent = () => {
    switch (selectedMethod) {
      case "stripe":
        return (
          <Payment
            cart={cart}
            totalPrice={totalPrice}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        );

      case "bkash":
        return (
          <BkashPayment
            cart={cart}
            totalPrice={totalPrice}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        );
      case "nagad":
        return (
          <NagadPayment
            cart={cart}
            totalPrice={totalPrice}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={handleBackToSelection}
          />
        );
      default:
        return null;
    }
  };

  if (selectedMethod) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50">
        <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleBackToSelection}
                  className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {paymentMethods.find((m) => m.id === selectedMethod)?.name}{" "}
                    Payment
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Complete your purchase securely
                  </p>
                </div>
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

          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:gap-8">
              {/* Order Summary */}
              <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://placehold.co/40x40?text=No+Image";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-500">Qty: 1</div>
                          </div>
                        </div>
                        <div className="font-semibold text-sm">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">
                        ${totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Component */}
              <div className="w-full lg:w-2/3">{renderPaymentComponent()}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Choose Payment Method
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select your preferred payment option
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

        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Order Summary */}
            <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/40x40?text=No+Image";
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">Qty: 1</div>
                        </div>
                      </div>
                      <div className="font-semibold text-sm">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="w-full lg:w-2/3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Methods
              </h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    disabled={!method.available}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      method.available
                        ? `hover:border-${method.color}-500 hover:shadow-lg cursor-pointer border-gray-200`
                        : "border-gray-200 opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                            method.id === "stripe"
                              ? "bg-blue-100"
                              : method.id === "bkash"
                              ? "bg-pink-100"
                              : "bg-orange-100"
                          }`}
                        >
                          {method.icon}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {method.available ? (
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-green-500 mr-2"
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
                  <div className="text-sm text-green-700">
                    All payments are secured with industry-standard encryption
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
