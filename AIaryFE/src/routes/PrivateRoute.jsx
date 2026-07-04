import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PrivateRoute = () => {
  const isLoggedIn = useAuthStore((s) => s.isAuthed());

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
