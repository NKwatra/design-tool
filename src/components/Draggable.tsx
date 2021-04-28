import type { Group as GroupType } from "konva/types/Group";
import { KonvaEventObject } from "konva/types/Node";
import type { Transformer as TransformerType } from "konva/types/shapes/Transformer";
import * as React from "react";
import { Group, Transformer } from "react-konva";
import { DispatchType } from "../lib/hooks";
import { setSelectedItem, updateItem } from "../redux/slice/diagram";

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
  /** If the current object is selected */
  isSelected?: boolean;
  /** Degree by which it is rotated */
  rotation: number | undefined;
};

const Draggable: React.FC<DraggableProps> = ({
  x,
  y,
  width,
  height,
  children,
  id,
  dispatch,
  isSelected,
  rotation = 0,
}) => {
  const shapeRef = React.useRef<GroupType>(null);
  const trRef = React.useRef<TransformerType>(null);

  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    let x = e.target.x();
    let y = e.target.y();
    dispatch(updateItem({ id, updates: { x, y } }));
  }

  function handleTransformEnd() {
    const node = shapeRef.current;
    const scaleX = node!.scaleX();
    const scaleY = node!.scaleY();
    const rotation = node!.rotation();

    /*
      Transform changes scale to resize nodes, 
      So we reset the scale back and update width
      andh height of node.
    */
    node!.scaleX(1);
    node!.scaleY(1);

    if (rotation === 0) {
      dispatch(
        updateItem({
          id,
          updates: {
            width: node!.width() * scaleX,
            height: node!.height() * scaleY,
          },
        })
      );
    } else {
      dispatch(
        updateItem({
          id,
          updates: {
            width: node!.width() * scaleX,
            height: node!.height() * scaleY,
            rotation,
          },
        })
      );
    }
  }

  function handleClick() {
    dispatch(setSelectedItem(id));
  }

  React.useEffect(() => {
    if (isSelected) {
      trRef.current?.nodes([shapeRef.current as GroupType]);
      trRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Group
        x={x}
        y={y}
        width={width}
        height={height}
        draggable
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        ref={shapeRef}
        onTransformEnd={handleTransformEnd}
        rotation={rotation}
      >
        {children}
      </Group>
      {isSelected && <Transformer ref={trRef} />}
    </>
  );
};

export default Draggable;