import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Menu from "../Pages/Menu/Menu";
import Order from "../Pages/Order/Order/Order";
import SignUp from "../Pages/SignUp/SignUp";
import Login from "../Pages/Login/Login";
import PrivateRoutes from "./PrivateRoutes";
import DashBoardLayout from "../Layout/DashBoardLayout";
import UserProfile from "../Pages/DashBoard/UserProfile";
import Cart from "../Pages/DashBoard/Cart";
import OrderHistory from "../Pages/DashBoard/OrderHistory";
import Reservations from "../Pages/DashBoard/Reservations";
import Favorites from "../Pages/DashBoard/Favorites";
import Addresses from "../Pages/DashBoard/Addresses";
import PaymentMethods from "../Pages/DashBoard/PaymentMethods";
import Notifications from "../Pages/DashBoard/Notifications";
import Settings from "../Pages/DashBoard/Settings";
import Support from "../Pages/DashBoard/Support";
import AllUsers from "../Pages/DashBoard/AllUsers";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/menu",
                element: <Menu/>                 
            },
            {
                path: "/order",
                element: <Order/>
            },
            {
                path: "/signUp",
                element: <SignUp/>                 
            },
            {
                path: "/login",
                element: <Login/>
            },               
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoutes><DashBoardLayout/></PrivateRoutes>,
        children: [
           
            {
                path: "/dashboard/profile",
                element: <UserProfile/>
            },
            {
                path: "/dashboard/allUsers",
                element: <AllUsers/>
            },
            {
                path: "/dashboard/cart",
                element: <Cart/>
            },
            {
                path: "/dashboard/orders",
                element: <OrderHistory/>
            },
            {
                path: "/dashboard/reservations",
                element: <Reservations/>
            },
            {
                path: "/dashboard/favorites",
                element: <Favorites/>
            },
            {
                path: "/dashboard/addresses",
                element: <Addresses/>
            },
            {
                path: "/dashboard/payment-methods",
                element: <PaymentMethods/>
            },
            {
                path: "/dashboard/notifications",
                element: <Notifications/>
            },
            {
                path: "/dashboard/settings",
                element: <Settings/>
            },
            {
                path: "/dashboard/support",
                element: <Support/>
            }
        ]
    }
]);