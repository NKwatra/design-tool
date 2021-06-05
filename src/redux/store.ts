import { configureStore } from "@reduxjs/toolkit";
import diagramReducer from "./slice/diagram";
import userReducer from "./slice/user";

const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
