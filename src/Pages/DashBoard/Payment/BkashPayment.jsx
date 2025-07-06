import { useState } from "react";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxios from "../../../hooks/useAxios";
const BkashPayment = ({ cart, totalPrice, onPaymentSuccess, onCancel }) => {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleBkashPayment = async (event) => {
    event.preventDefault();

    if (!phone || !pin) {
      setPaymentError("Please enter both phone number and PIN");
      return;
    }

    if (phone.length !== 11 || !phone.startsWith("01")) {
      setPaymentError(
        "Please enter a valid Bangladeshi phone number (11 digits starting with 01)"
      );
      return;
    }

    setProcessing(true);
    setPaymentError("");

    try {
      // Step 1: Create bKash payment
      const createPaymentResponse = await axiosSecure.post(
        "/bkash/create-payment",
        {
          amount: totalPrice,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: `INV-${Date.now()}`,
        }
      );

      if (!createPaymentResponse.data.paymentID) {
        throw new Error("Failed to create bKash payment");
      }

      const { paymentID, bkashURL } = createPaymentResponse.data;

      // Step 2: Execute payment with user credentials
      const executePaymentResponse = await axiosSecure.post(
        "/bkash/execute-payment",
        {
          paymentID,
          phone,
          pin,
        }
      );

      if (executePaymentResponse.data.statusCode === "0000") {
        // Payment successful
        const orderData = {
          email: user.email,
          userName: user.displayName,
          items: cart,
          totalPrice: totalPrice,
          paymentMethod: "bKash",
          paymentID: paymentID,
          transactionID: executePaymentResponse.data.trxID,
          status: "paid",
          orderDate: new Date(),
          deliveryStatus: "pending",
          paymentDetails: {
            phone: phone,
            currency: "BDT",
            amount: totalPrice,
          },
        };

        const orderResult = await axiosSecure.post("/orders", orderData);

        if (orderResult.data.insertedId) {
          // Clear cart
          await axiosSecure.delete(`/carts?email=${user.email}`);

          Swal.fire({
            title: "Payment Successful!",
            text: `Your bKash payment of ৳${totalPrice} has been completed successfully.`,
            icon: "success",
            confirmButtonText: "OK",
          });

          onPaymentSuccess();
        }
      } else {
        throw new Error(
          executePaymentResponse.data.statusMessage || "Payment failed"
        );
      }
    } catch (error) {
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Payment failed. Please try again."
      );
      console.error("bKash payment error:", error);
    }

    setProcessing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">bK</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">bKash Payment</h3>
          <p className="text-sm text-gray-500">Pay securely with bKash</p>
        </div>
      </div>

      <form onSubmit={handleBkashPayment} className="space-y-4">
        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash Account Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
            maxLength="11"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        {/* PIN */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            bKash PIN
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter your bKash PIN"
            maxLength="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
        </div>

        {/* Amount Display */}
        <div className="bg-pink-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Amount to Pay:
            </span>
            <span className="text-lg font-bold text-pink-600">
              ৳{totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
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
              <span className="text-sm text-red-700">{paymentError}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={processing}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
            processing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
          }`}
        >
          {processing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5"
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
              Pay ৳{totalPrice.toFixed(2)} with bKash
            </>
          )}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full py-3 px-6 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </form>

      {/* Security Notice */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500">
          🔒 Your payment is secured by bKash
        </div>
      </div>
    </div>
  );
};

export default BkashPayment;
