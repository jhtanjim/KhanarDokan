import { IoRestaurantOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { navBarMenu } from "../../../public/MocData/navdata";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <Link to="/" className="flex gap-1 items-center text-2xl font-bold">
            <IoRestaurantOutline />
            <span>Khanar</span>
            <span className="text-secondary">Dokan</span>
          </Link>{" "}
          <p className="text-gray-400">
            Where flavors meet passion. Come enjoy the best food in town!
          </p>
        </div>

        {/* Dynamic Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            {navBarMenu.map((item) => (
              <li key={item.id}>
                <a href={item.link} className="hover:text-white">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-400">📍 123 Food Street, Dhaka, Bangladesh</p>
          <p className="text-gray-400">📞 +880 123 456 7890</p>
          <p className="text-gray-400">✉️ khanardokan@email.com</p>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-10 border-t pt-4 border-gray-700">
        &copy; {new Date().getFullYear()} Khanar Dokan. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
