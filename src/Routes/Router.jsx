import { createBrowserRouter } from "react-router-dom";
import DashBoardLayout from "../Layout/DashBoardLayout";
import Main from "../Layout/Main";
import Contact from "../Pages/Contact/Contact";
import Addresses from "../Pages/DashBoard/Addresses";
import AdminOrders from "../Pages/DashBoard/AdminOrders";
import AllReservation from "../Pages/DashBoard/AllReservation";
import AllReviews from "../Pages/DashBoard/AllReviews";
import AllUsers from "../Pages/DashBoard/AllUsers";
import Cart from "../Pages/DashBoard/Cart";
import DashBoard from "../Pages/DashBoard/DashBoard";
import MenuForm from "../Pages/DashBoard/MenuForm";
import Notifications from "../Pages/DashBoard/Notifications";
import OrderHistory from "../Pages/DashBoard/OrderHistory";
import PaymentMethods from "../Pages/DashBoard/PaymentMethods";
import Reservations from "../Pages/DashBoard/Reservations";
import Settings from "../Pages/DashBoard/Settings";
import Support from "../Pages/DashBoard/Support";
import SupportList from "../Pages/DashBoard/SupportList";
import UserProfile from "../Pages/DashBoard/UserProfile";
import Favorites from "../Pages/Favorites/Favorites";
import Home from "../Pages/Home/Home/Home";
import Login from "../Pages/Login/Login";
import Menu from "../Pages/Menu/Menu";
import Order from "../Pages/Order/Order/Order";
import ReservationCreate from "../Pages/Reservation/ReservationCreate";
import Reviews from "../Pages/Reviews/Reviews";
import SignUp from "../Pages/SignUp/SignUp";
import UnderConstruction from "../Pages/UnderConstruction/UnderConstruction";
import PrivateRoutes from "./PrivateRoutes";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
      },
      {
        path: "/favourites",
        element: <Favorites />,
      },
      {
        path: "/reservation",
        element: <ReservationCreate />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/signUp",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/reviews",
        element: <Reviews />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashBoardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/dashboard/profile",
        element: <UserProfile />,
      },
      {
        path: "/dashboard/allReservations",
        element: <AllReservation />,
      },
      {
        path: "/dashboard/allUsers",
        element: <AllUsers />,
      },
      {
        path: "/dashboard/allOrders",
        element: <AdminOrders />,
      },
      {
        path: "/dashboard/cart",
        element: <Cart />,
      },
      {
        path: "/dashboard/orders",
        element: <OrderHistory />,
      },
      {
        path: "/dashboard/menuForm",
        element: <MenuForm />,
      },
      {
        path: "/dashboard/allReviews",
        element: <AllReviews />,
      },
      {
        path: "/dashboard/reservations",
        element: <Reservations />,
      },
      {
        path: "/dashboard/favorites",
        element: <Favorites />,
      },
      {
        path: "/dashboard/addresses",
        element: <Addresses />,
      },
      {
        path: "/dashboard/payment-methods",
        element: <PaymentMethods />,
      },
      {
        path: "/dashboard/notifications",
        element: <Notifications />,
      },
      {
        path: "/dashboard/settings",
        element: <Settings />,
      },
      {
        path: "/dashboard/support",
        element: <Support />,
      },
      {
        path: "/dashboard/supportList",
        element: <SupportList />,
      },
    ],
  },
  { path: "*", element: <UnderConstruction /> },
]);
