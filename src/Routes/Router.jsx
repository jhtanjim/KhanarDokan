import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home/Home/Home";
import Menu from "../Pages/Menu/Menu";
import Order from "../Pages/Order/Order/Order";
import SignUp from "../Pages/SignUp/SignUp";
import Login from "../Pages/Login/Login";
import DashBoard from "../Pages/DashBoard/DashBoard";
import PrivateRoutes from "./PrivateRoutes";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <Main/>,
      children:[
        {
            path:"/",
            element:<Home/>
        },
        {
            path:"/menu",
            element:<Menu/>
        
        },
        {
            path:"/order",
            element:<Order/>
        },{
            path:"/signUp",
            element:<SignUp/>
        
        },
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/dashBoard",
            element:<PrivateRoutes><DashBoard/></PrivateRoutes>
        },

      ]
    },
  ]);