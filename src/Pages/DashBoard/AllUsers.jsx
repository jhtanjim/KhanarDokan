import {
  Crown,
  Mail,
  Phone,
  Shield,
  Star,
  Trash2,
  User,
  UserCheck,
  UserX,
} from "lucide-react";
import Swal from "sweetalert2";
import useAdmin from "../../hooks/useAdmin";
import useAxios from "../../hooks/useAxios";

import useSuperAdmin from "../../hooks/useAdmin";
import useUsers from "../../hooks/useUsers";

const AllUsers = () => {
  const { users, isLoading, refetch } = useUsers();
  const [isSuperAdmin] = useSuperAdmin();
  const [isAdmin] = useAdmin();
  const axiosSecure = useAxios();
  console.log(users);
  const handleMakeAdmin = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Make ${user.name} an admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#D97706",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, make admin!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/users/admin/${user._id}`);
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: "Success!",
              text: `${user.name} is now an admin!`,
              icon: "success",
              confirmButtonColor: "#D97706",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to make user admin",
            icon: "error",
            confirmButtonColor: "#D97706",
          });
        }
      }
    });
  };

  const handleMakeSuperAdmin = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Make ${user.name} a Super Admin? This gives them full access!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, make Super Admin!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/users/superadmin/${user._id}`);
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: "Success!",
              text: `${user.name} is now a Super Admin!`,
              icon: "success",
              confirmButtonColor: "#7C3AED",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text:
              error.response?.data?.message ||
              "Failed to make user Super Admin",
            icon: "error",
            confirmButtonColor: "#D97706",
          });
        }
      }
    });
  };

  const handleDemoteUser = async (user) => {
    const roleText = user.role === "superadmin" ? "Super Admin" : "Admin";
    Swal.fire({
      title: "Are you sure?",
      text: `Demote ${user.name} from ${roleText} to regular user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, demote!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/users/demote/${user._id}`);
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: "Success!",
              text: `${user.name} has been demoted to regular user!`,
              icon: "success",
              confirmButtonColor: "#D97706",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to demote user",
            icon: "error",
            confirmButtonColor: "#D97706",
          });
        }
      }
    });
  };

  const handleDeleteUser = async (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete ${user.name}? This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/users/${user._id}`);
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: `${user.name} has been deleted.`,
              icon: "success",
              confirmButtonColor: "#D97706",
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: error.response?.data?.message || "Failed to delete user",
            icon: "error",
            confirmButtonColor: "#D97706",
          });
        }
      }
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "superadmin":
        return (
          <div className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <Star size={12} />
            Super Admin
          </div>
        );
      case "admin":
        return (
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
            <Crown size={12} />
            Admin
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 bg-green-400 text-green-900 px-2 py-1 rounded-full text-xs font-medium">
            <UserCheck size={12} />
            User
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-600 text-white rounded-lg">
              <User size={24} />
            </div>
            <h1 className="text-3xl font-bold text-amber-900">All Users</h1>
          </div>
          <p className="text-amber-700">Manage your application users</p>
          <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-4">
              <p className="text-amber-800 font-medium">
                Total Users:{" "}
                <span className="text-amber-600">{users.length}</span>
              </p>
              <p className="text-purple-800 font-medium">
                Super Admins:{" "}
                <span className="text-purple-600">
                  {users.filter((u) => u.role === "superadmin").length}
                </span>
              </p>
              <p className="text-yellow-800 font-medium">
                Admins:{" "}
                <span className="text-yellow-600">
                  {users.filter((u) => u.role === "admin").length}
                </span>
              </p>
              <p className="text-green-800 font-medium">
                Users:{" "}
                <span className="text-green-600">
                  {users.filter((u) => u.role === "user" || !u.role).length}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {users.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <User size={48} className="mx-auto text-amber-300 mb-4" />
            <h3 className="text-xl font-semibold text-amber-800 mb-2">
              No Users Found
            </h3>
            <p className="text-amber-600">No users have registered yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* User Card Header */}
                <div
                  className={`p-4 ${
                    user.role === "superadmin"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600"
                      : user.role === "admin"
                      ? "bg-gradient-to-r from-amber-500 to-amber-600"
                      : "bg-gradient-to-r from-green-500 to-green-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <User size={24} className="text-gray-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">
                        {user.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Card Body */}
                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone size={16} />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-600">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Action Buttons - Only Super Admins can see and use these */}
                  {isSuperAdmin && (
                    <div className="mt-4 space-y-2">
                      {/* Role Management Buttons */}
                      <div className="flex gap-2">
                        {user.role === "user" && (
                          <button
                            onClick={() => handleMakeAdmin(user)}
                            className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                          >
                            <Shield size={16} />
                            Make Admin
                          </button>
                        )}
                        {user.role === "admin" && (
                          <>
                            <button
                              onClick={() => handleMakeSuperAdmin(user)}
                              className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              <Star size={16} />
                              Super Admin
                            </button>
                            <button
                              onClick={() => handleDemoteUser(user)}
                              className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                            >
                              <UserX size={16} />
                              Demote
                            </button>
                          </>
                        )}
                        {user.role === "superadmin" && (
                          <button
                            onClick={() => handleDemoteUser(user)}
                            className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                          >
                            <UserX size={16} />
                            Demote
                          </button>
                        )}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="w-full bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete User
                      </button>
                    </div>
                  )}

                  {/* Limited actions for regular admins */}
                  {isAdmin && !isSuperAdmin && (
                    <div className="mt-4 text-center text-sm text-gray-500">
                      <p>Contact Super Admin for user management</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
