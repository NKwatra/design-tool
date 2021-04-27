import { configureStore } from "@reduxjs/toolkit";
import diagramReducer from "./slice/diagram";

const store = configureStore({
  reducer: {
    diagram: diagramReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
