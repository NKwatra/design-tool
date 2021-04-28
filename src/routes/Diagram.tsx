import * as React from "react";
import { Layer, Stage } from "react-konva";
import Attribute from "../components/Attribute";
import Entity from "../components/Entity";
import Relation from "../components/Relation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { selectDiagram } from "../redux/slice/diagram";
import { AppDispatch } from "../redux/store";
import type { IItem } from "../types/item";

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const renderItem = (
  item: IItem,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  switch (item.type) {
    case "entity":
      return <Entity {...item.item} key={item.item.id} dispatch={dispatch} />;
    case "attribute":
      return (
        <Attribute {...item.item} key={item.item.id} dispatch={dispatch} />
      );
    case "relation":
      return <Relation {...item.item} key={item.item.id} dispatch={dispatch} />;
    default:
      return assertNever(item);
  }
};

const Diagram: React.FC = () => {
  const items = useAppSelector(selectDiagram);
  const dispatch = useAppDispatch();
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>{items.map((item) => renderItem(item, dispatch))}</Layer>
    </Stage>
  );
};

export default Diagram;
