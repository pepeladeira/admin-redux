import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import reducers from "./ducks";
import showAlert from "./middlewares/showAlert";

export default function () {
  return configureStore({
    reducers,
    middleware: [...getDefaultMiddleware(), showAlert],
  });
}
