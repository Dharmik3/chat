import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children: JSX.Element;
}

// check if user is laready present then login and signup page should not be accessible
const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

export default PublicRoute;
