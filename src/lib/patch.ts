import type { IItem } from "../types/item";
import { produce } from "immer";

const generateAddPatch = (currObj: IItem[], payload: IItem) => {
  const state = {
    items: currObj,
  };
  let allPatches: any[] = [];
  produce(
    state,
    (draft) => {
      draft.items.push(payload);
    },
    (patches) => allPatches.push(...patches)
  );
  return allPatches.map((patch) => ({
    ...patch,
    path: "/" + patch.path.join("/"),
  }));
};

const generateUpdatePatch = (
  items: IItem[],
  id: string,
  update: Partial<IItem["item"]>
) => {
  const state = {
    items,
  };
  let allPatches: any[] = [];

  produce(
    state,
    (draft) => {
      let itemIndex = draft.items.findIndex((i) => i.item.id === id);
      let item = draft.items[itemIndex].item;
      let updates = update;
      for (let key in updates) {
        // @ts-ignore
        item[key] = updates[key];
      }
    },
    (patches) => allPatches.push(...patches)
  );
  return allPatches.map((patch) => ({
    ...patch,
    path: "/" + patch.path.join("/"),
  }));
};

const generateRemovePatch = (items: IItem[], id: string) => {
  let allPatches: any[] = [];
  const state = { items };
  produce(
    state,
    (draft) => {
      draft.items = draft.items.filter((item) => item.item.id !== id);
    },
    (patches) => allPatches.push(...patches)
  );
  return allPatches.map((patch) => ({
    ...patch,
    path: "/" + patch.path.join("/"),
  }));
};

const patchServices = {
  generateAddPatch,
  generateUpdatePatch,
  generateRemovePatch,
};

export default patchServices;
