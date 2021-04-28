import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../../types/item";
import { RootState } from "../store";

const initialState: IItem[] = [
  {
    type: "entity",
    item: {
      x: 100,
      y: 200,
      id: "165387290",
    },
  },
  {
    type: "attribute",
    item: {
      x: 500,
      y: 200,
      id: "176803654",
    },
  },
  {
    type: "relation",
    item: {
      x: 700,
      y: 300,
      id: "875298163",
    },
  },
];

type UpdateItemActionPayload = {
  id: string;
  updates: Partial<IItem["item"]>;
};

function isPropOfItem(
  prop: string,
  item: IItem["item"]
): prop is keyof typeof item {
  return item.hasOwnProperty(prop);
}

const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IItem>) => {
      state.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<UpdateItemActionPayload>) => {
      let itemIndex = state.findIndex((i) => i.item.id === action.payload.id);
      let item = state[itemIndex].item;
      let updates = action.payload.updates;
      for (let key in updates) {
        if (
          isPropOfItem(key, item) &&
          typeof updates[key] === typeof item[key]
        ) {
          // @ts-ignore
          item[key] = updates[key];
        }
      }
    },
  },
});

export const selectDiagram = (state: RootState) => state.diagram;
export const { addItem, updateItem } = diagramSlice.actions;
export default diagramSlice.reducer;
