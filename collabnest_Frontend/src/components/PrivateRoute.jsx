import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../service/tokenService";

const PrivateRoute = () => {
  const token = getToken();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
