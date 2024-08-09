import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import { routes } from "../constants.ts";
import { NoMatch } from "../components/NoMatch/NoMatch.tsx";
import { Home } from "../components/Home/Home.tsx";
import { ErrorHome } from "../components/Home/ErrorHome.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NoMatch />} />
      <Route
        path={routes.home.path}
        id={routes.home.id}
        element={<Home />}
        errorElement={<ErrorHome />}
      />
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
