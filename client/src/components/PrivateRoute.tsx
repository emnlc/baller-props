import { UserAuth } from "@/context/AuthContext";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = UserAuth();

  if (isLoading || session === undefined) {
    return <span>Loading ...</span>;
  }

  return session ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
