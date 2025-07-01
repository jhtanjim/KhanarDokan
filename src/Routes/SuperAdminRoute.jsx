// SuperAdminRoute.js - Super Admin only access
import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import useSuperAdmin from "../hooks/useSuperAdmin.JSX";

const SuperAdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [isSuperAdmin, isSuperAdminLoading] = useSuperAdmin();
  const location = useLocation();

  if (loading || isSuperAdminLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (user && isSuperAdmin) {
    return children;
  }

  return <Navigate to="/" state={{ from: location }} replace />;
};

export default SuperAdminRoute;
