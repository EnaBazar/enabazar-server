import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(MyContext);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;