import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Component/Footer/Footer";
import Navbar from "../Component/Navbar/Navbar";
import ScrollToTop from "../Component/ScrollToTop/ScrollToTop";

const Main = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signup");
  return (
    <div className="h-screen flex flex-col">
      <ScrollToTop />
      <main
        className="flex-1 overflow-y-auto scrollbar-hidden"
        id="main-content"
      >
        {" "}
        {noHeaderFooter || <Navbar />}
        <Outlet />
        {noHeaderFooter || <Footer />}
      </main>
    </div>
  );
};
export default Main;
