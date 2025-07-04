import { IoRestaurant } from "react-icons/io5";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-white px-4">
      <div className="text-center max-w-lg">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary text-white p-5 rounded-full shadow-md">
            <IoRestaurant className="text-4xl" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">
          We're Cooking Something Special!
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-base md:text-lg mb-6">
          This page is currently under construction. We’re adding fresh flavors
          and delicious content—check back soon!
        </p>

        {/* Optional CTA */}
        <p className="text-sm text-gray-500">
          Need help?{" "}
          <a
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
};

export default UnderConstruction;
