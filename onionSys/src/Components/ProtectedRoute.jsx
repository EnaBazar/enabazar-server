import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useContext(MyContext);

  // যদি token check হচ্ছে (initial null), loading/null state
  if (isLogin === null) return null;

  return isLogin ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;