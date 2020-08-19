import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import reducers from "./ducks";

export default function () {
  return configureStore({
    reducers,
    middleware: [...getDefaultMiddleware()],
  });
}
