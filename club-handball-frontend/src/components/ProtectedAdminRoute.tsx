import { Navigate, Outlet } from "react-router";

export default function ProtectedAdminRoute() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    return <Navigate to="/connexion" replace />;
  }

  return <Outlet />;
}