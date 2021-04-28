import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../../types/item";
import { RootState } from "../store";

interface DiagramState {
  selectedItem: string | null;
  items: IItem[];
}

const initialState: DiagramState = {
  selectedItem: null,
  items: [
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
  ],
};

type UpdateItemActionPayload = {
  id: string;
  updates: Partial<IItem["item"]>;
};

const diagramSlice = createSlice({
  name: "diagram",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<IItem>) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<UpdateItemActionPayload>) => {
      let itemIndex = state.items.findIndex(
        (i) => i.item.id === action.payload.id
      );
      let item = state.items[itemIndex].item;
      let updates = action.payload.updates;
      for (let key in updates) {
        // @ts-ignore
        item[key] = updates[key];
      }
    },
    setSelectedItem: (state, action: PayloadAction<string | null>) => {
      state.selectedItem = action.payload;
    },
  },
});

export const selectDiagram = (state: RootState) => state.diagram.items;
export const selectItemCurrentlySelected = (state: RootState) => {
  let item = state.diagram.items.find(
    (i) => i.item.id === state.diagram.selectedItem
  );
  return item ? item : null;
};
export const { addItem, updateItem, setSelectedItem } = diagramSlice.actions;
export default diagramSlice.reducer;
