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
import { StoreProvider } from "../shared/store/StoreProvider.tsx";
import { Score } from "../components/Home/Score/Score.tsx";
import { ErrorScore } from "../components/Home/Score/ErrorScore.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NoMatch />} />
      <Route
        path={routes.home.path}
        id={routes.home.id}
        element={<Home />}
        errorElement={<ErrorHome />}
      >
        <Route
          path={routes.score.path}
          id={routes.score.id}
          element={<Score />}
          errorElement={<ErrorScore />}
        />
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </React.StrictMode>
);
