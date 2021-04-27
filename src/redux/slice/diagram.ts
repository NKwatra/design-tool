import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../../types/item";
import { RootState } from "../store";

const initialState: IItem[] = [];

const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IItem>) => {
      state.push(action.payload);
    },
  },
});

export const selectDiagram = (state: RootState) => state.diagram;
export const { addItem } = diagramSlice.actions;
export default diagramSlice.reducer;
