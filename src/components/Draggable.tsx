import type { Group as GroupType } from "konva/types/Group";
import { KonvaEventObject } from "konva/types/Node";
import type { Transformer as TransformerType } from "konva/types/shapes/Transformer";
import * as React from "react";
import { Circle, Group, Transformer } from "react-konva";
import { DispatchType } from "../lib/hooks";
import {
  setSelectedItem,
  startDrawing,
  updateItem,
} from "../redux/slice/diagram";
import { assertNever } from "../routes/Diagram";

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
}) => {
  const shapeRef = React.useRef<GroupType>(null);
  const trRef = React.useRef<TransformerType>(null);
  const positions = [
    { x: width + 10, y: height / 4 },
    { x: width + 10, y: (3 * height) / 4 },
    { x: width / 4, y: height + 10 },
    { x: (3 * width) / 4, y: height + 10 },
    { x: -10, y: height / 4 },
    { x: -10, y: (3 * height) / 4 },
    { x: width / 4, y: -10 },
    { x: (3 * width) / 4, y: -10 },
  ];

  function handleDragEnd(e: KonvaEventObject<DragEvent>) {
    let x = e.target.x();
    let y = e.target.y();
    dispatch(updateItem({ id, updates: { x, y } }));
  }

  function handleMouseEnter(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "all-scroll";
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "default";
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

    switch (type) {
      case "entity":
      case "text":
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
        break;
      case "relation":
        dispatch(
          updateItem({
            id,
            updates: {
              radius: (node!.width() * scaleX) / 2,
              rotation,
            },
          })
        );
        break;
      case "attribute":
        dispatch(
          updateItem({
            id,
            updates: {
              xRadius: (node!.width() * scaleX) / 2,
              yRadius: (node!.height() * scaleY) / 2,
              rotation,
            },
          })
        );
        break;
      default:
        return assertNever(type);
    }
  }

  function handleMouseEnterOnConnector(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "pointer";
  }

  function handleMouseLeaveOnConnector(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "auto";
  }

  function handleClickOnConnector(e: KonvaEventObject<MouseEvent>) {
    let { clientX, clientY } = e.evt;
    clientX -= 166;
    clientY -= 86;
    if (clientX < x) {
      clientX += 10;
    } else {
      clientX -= 10;
    }

    if (clientY < y) {
      clientY += 10;
    } else {
      clientY -= 10;
    }

    dispatch(
      startDrawing({
        id: Date.now().toString(),
        points: [clientX, clientY],
      })
    );
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
          rotateAnchorOffset={30}
          anchorSize={6}
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
      {isSelected &&
        positions.map((position, index) => (
          <Circle
            x={x + position.x}
            y={y + position.y}
            key={(position.x * index + position.y * (index + 1)).toString()}
            radius={4}
            fill="red"
            onMouseEnter={handleMouseEnterOnConnector}
            onMouseLeave={handleMouseLeaveOnConnector}
            hitStrokeWidth={8}
            onClick={handleClickOnConnector}
          />
        ))}
    </>
  );
};

export default Draggable;
