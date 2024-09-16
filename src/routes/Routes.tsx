import React from "react";
import { useRoutes } from "react-router-dom";
import { Chat, Login, Signup } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";
import PublicRoute from "./PublicRoutes";

export const appRoutes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
];

const AppRoutes = () => {
  const routes = useRoutes(appRoutes);
  return routes;
};

export default AppRoutes;
