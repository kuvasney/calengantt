import { configureStore } from "@reduxjs/toolkit";
import projectsReducer from "./projectsSlice";
import productsReducer from "./productsSlice";

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
