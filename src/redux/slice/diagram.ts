import { createSlice, PayloadAction, createNextState } from "@reduxjs/toolkit";
import { IItem } from "../../types/item";
import { RootState } from "../store";
import { enablePatches } from "immer";

enablePatches();
interface DiagramState {
  title: string;
  selectedItem: string | null;
  items: IItem[];
  currentDrawing: { isDrawing: boolean; id: string } | null;
}

const initialState: DiagramState = {
  selectedItem: null,
  currentDrawing: null,
  items: [],
  title: "",
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
      let allPatches: any[] = [];
      const nextState = createNextState(
        state,
        (draft) => {
          draft.items.push(action.payload);
        },
        (patches) => {
          allPatches.push(...patches);
        }
      );
      console.log(
        allPatches.map((patch) => ({
          ...patch,
          path: patch.path.join("/"),
        }))
      );
      return nextState;
    },
    updateItem: (state, action: PayloadAction<UpdateItemActionPayload>) => {
      let allPatches: any[] = [];
      const nextState = createNextState(
        state,
        (draft) => {
          let itemIndex = draft.items.findIndex(
            (i) => i.item.id === action.payload.id
          );
          let item = draft.items[itemIndex].item;
          let updates = action.payload.updates;
          for (let key in updates) {
            // @ts-ignore
            item[key] = updates[key];
          }
        },
        (patches) => {
          allPatches.push(...patches);
        }
      );
      console.log(
        allPatches.map((patch) => ({
          ...patch,
          path: patch.path.join("/"),
        }))
      );
      return nextState;
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
} = diagramSlice.actions;
export default diagramSlice.reducer;
