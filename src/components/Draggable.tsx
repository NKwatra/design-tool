import type { Group as GroupType } from "konva/types/Group";
import { KonvaEventObject } from "konva/types/Node";
import type { Transformer as TransformerType } from "konva/types/shapes/Transformer";
import * as React from "react";
import { Group, Transformer } from "react-konva";
import { DispatchType } from "../lib/hooks";
import { setSelectedItem, updateItem } from "../redux/slice/diagram";
import { assertNever } from "../routes/Diagram";
import { IItem } from "../types/item";

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
  /** The type of node that is children of this */
  type: "entity" | "relation" | "attribute" | "text";
  /**
   * Function to send patch on object drag
   */
  onDrag: (id: string, updates: Partial<IItem["item"]>) => void;
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
  type,
  onDrag,
}) => {
  const shapeRef = React.useRef<GroupType>(null);
  const trRef = React.useRef<TransformerType>(null);

  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    let x = e.target.x();
    let y = e.target.y();
    dispatch(updateItem({ id, updates: { x, y } }));
    onDrag(id, { x, y });
  }

  function handleMouseEnter(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "all-scroll";
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "default";
  }

  async function handleTransformEnd() {
    const node = shapeRef.current;
    const scaleX = node!.scaleX();
    const scaleY = node!.scaleY();
    // const rotation = node!.rotation();

    /*
      Transform changes scale to resize nodes, 
      So we reset the scale back and update width
      andh height of node.
    */
    node!.scaleX(1);
    node!.scaleY(1);

    switch (type) {
      case "entity":
      case "text":
        onDrag(id, {
          width: node!.width() * scaleX,
          height: node!.height() * scaleY,
          x: node!.x(),
          y: node!.y(),
          // rotation,
        });
        dispatch(
          updateItem({
            id,
            updates: {
              width: node!.width() * scaleX,
              height: node!.height() * scaleY,
              x: node!.x(),
              y: node!.y(),
              // rotation,
            },
          })
        );

        break;
      case "relation":
        onDrag(id, {
          radius: (node!.width() * scaleX) / 2,
          x: node!.x(),
          y: node!.y(),
          // rotation,
        });
        dispatch(
          updateItem({
            id,
            updates: {
              radius: (node!.width() * scaleX) / 2,
              x: node!.x(),
              y: node!.y(),
              // rotation,
            },
          })
        );

        break;
      case "attribute":
        onDrag(id, {
          xRadius: (node!.width() * scaleX) / 2,
          yRadius: (node!.height() * scaleY) / 2,
          // rotation,
        });
        dispatch(
          updateItem({
            id,
            updates: {
              xRadius: (node!.width() * scaleX) / 2,
              yRadius: (node!.height() * scaleY) / 2,
              // rotation,
            },
          })
        );
        break;
      default:
        return assertNever(type);
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          anchorSize={6}
          centeredScaling
          rotateEnabled={false}
          enabledAnchors={
            type === "relation"
              ? ["top-left", "top-right", "bottom-left", "bottom-right"]
              : [
                  "top-left",
                  "top-center",
                  "top-right",
                  "middle-right",
                  "middle-left",
                  "bottom-left",
                  "bottom-center",
                  "bottom-right",
                ]
          }
        />
      )}
    </>
  );
};

export default Draggable;
