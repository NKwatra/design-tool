import * as React from "react";
import { Layer, Stage } from "react-konva";
import Attribute from "../components/Attribute";
import Entity from "../components/Entity";
import Relation from "../components/Relation";
import { useAppSelector } from "../lib/hooks";
import type { IItem } from "../types/item";

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const renderItem = (item: IItem) => {
  switch (item.type) {
    case "entity":
      return <Entity {...item.item} id={item.id} key={item.id} />;
    case "attribute":
      return <Attribute {...item.item} id={item.id} key={item.id} />;
    case "relation":
      return <Relation {...item.item} id={item.id} key={item.id} />;
    default:
      return assertNever(item);
  }
};

const Dashboard: React.FC = () => {
  const items = useAppSelector((state) => state.diagram);
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>{items.map((item) => renderItem(item))}</Layer>
    </Stage>
  );
};

export default Dashboard;
