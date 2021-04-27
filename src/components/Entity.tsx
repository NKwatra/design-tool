import * as React from "react";
import { Group, Rect, Text } from "react-konva";

type Props = {
  /** width of entity */
  width: number;
  /** height of entity */
  height: number;
  /** x position of entity */
  x: number;
  /** y position of entity */
  y: number;
  /** border color of entity */
  stroke: string;
  /** border width of entity */
  strokeWidth: number;
  /** Name of the entity*/
  name?: string;
  /** color to use for name */
  nameColor?: string;
  /** width of text to use for name */
  nameWidth?: number;
  /** whether it is a weak entity or not */
  weakEntity?: boolean;
};

const Entity: React.FC<Props> = ({
  width,
  height,
  x,
  y,
  stroke,
  strokeWidth,
  name,
  nameColor,
  nameWidth,
  weakEntity,
}) => {
  const text = name || weakEntity ? "Weak Entity" : "Entity";
  return (
    <Group draggable x={x} y={y} width={width} height={height}>
      <Rect
        width={width}
        height={height}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <Text
        width={width}
        height={height}
        verticalAlign="middle"
        align="center"
        stroke={nameColor || stroke}
        strokeWidth={nameWidth || strokeWidth * 0.75}
        text={text}
        fontSize={16}
      />
      {weakEntity ? (
        <Rect
          width={width - 10}
          height={height - 10}
          stroke={stroke}
          strokeWidth={strokeWidth}
          x={5}
          y={5}
        />
      ) : null}
    </Group>
  );
};

export default Entity;
