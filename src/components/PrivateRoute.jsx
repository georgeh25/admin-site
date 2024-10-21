import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return isAuthenticated ? <Element /> : <Navigate to="/login" />;
};

export default PrivateRoute;
