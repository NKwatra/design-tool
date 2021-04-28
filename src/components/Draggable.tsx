import { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Group } from "react-konva";
import { DispatchType } from "../lib/hooks";
import { updateItem } from "../redux/slice/diagram";

type DraggableProps = {
  /** x position of item */
  x: number;
  /** y position of item */
  y: number;
  /** width of item */
  width: number;
  /** height of item */
  height: number;
  /** children nodes of draggable container */
  children: React.ReactNode;
  /** id of child item */
  id: string;
  /** Redux dispatch function to be passed down */
  dispatch: DispatchType;
};

const Draggable: React.FC<DraggableProps> = ({
  x,
  y,
  width,
  height,
  children,
  id,
  dispatch,
}) => {
  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    let x = e.target.x();
    let y = e.target.y();
    dispatch(updateItem({ id, updates: { x, y } }));
  }

  return (
    <Group
      x={x}
      y={y}
      width={width}
      height={height}
      draggable
      onDragEnd={handleDragEnd}
    >
      {children}
    </Group>
  );
};

export default Draggable;
