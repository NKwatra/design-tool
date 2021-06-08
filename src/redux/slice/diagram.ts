import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "../../types/item";
import { RootState } from "../store";
import { enablePatches } from "immer";
import { Version } from "../../types/document";

enablePatches();
interface DiagramState {
  title: string;
  selectedItem: string | null;
  items: IItem[];
  currentDrawing: { isDrawing: boolean; id: string } | null;
  versions: Version[];
}

const initialState: DiagramState = {
  selectedItem: null,
  currentDrawing: null,
  items: [],
  title: "",
  versions: [],
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
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item) => item.item.id !== action.payload
      );
    },
    startDrawing: (
      state,
      action: PayloadAction<{ points: number[]; id: string }>
    ) => {
      state.items.push({ type: "connector", item: action.payload });
      state.currentDrawing = { isDrawing: true, id: action.payload.id };
    },
    endDrawing: (
      state,
      action: PayloadAction<{ points: number[]; id: string }>
    ) => {
      let item = state.items.find((item) => item.item.id === action.payload.id);
      if (item?.type === "connector") {
        item.item.points = [
          ...item!.item!.points.slice(0, 2),
          ...action.payload.points,
        ];
      }
      state.currentDrawing = null;
    },
    updatePoints: (
      state,
      action: PayloadAction<{ points: number[]; id: string }>
    ) => {
      let item = state.items.find((item) => item.item.id === action.payload.id);
      if (item?.type === "connector") {
        item.item.points = [
          ...item!.item!.points.slice(0, 2),
          ...action.payload.points,
        ];
      }
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setItems: (state, action: PayloadAction<IItem[]>) => {
      state.items = action.payload;
    },
    setVersions: (state, action: PayloadAction<Version[]>) => {
      state.versions = action.payload;
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
export const selectCurrentDrawing = (state: RootState) =>
  state.diagram.currentDrawing;
export const selectTitle = (state: RootState) => state.diagram.title;
export const selectVersions = (state: RootState) => state.diagram.versions;

export const {
  addItem,
  updateItem,
  setSelectedItem,
  removeItem,
  updatePoints,
  startDrawing,
  endDrawing,
  setTitle,
  setItems,
  setVersions,
} = diagramSlice.actions;
export default diagramSlice.reducer;
