import { Navigate } from "react-router";
import {useAuth} from "../context/AuthContext"


type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    user &&
    !allowedRoles.some((role) => user.roles.includes(role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}