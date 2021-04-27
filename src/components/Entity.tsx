import * as React from "react";
import { Group, Rect, Text } from "react-konva";
import theme from "../lib/theme";

type Props = {
  /** width of entity */
  width?: number;
  /** height of entity */
  height?: number;
  /** x position of entity */
  x: number;
  /** y position of entity */
  y: number;
  /** border color of entity */
  stroke?: string;
  /** border width of entity */
  strokeWidth?: number;
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
  width = 200,
  height = 100,
  x,
  y,
  stroke = theme.itemDefaultColor,
  strokeWidth = theme.itemStrokeDefaultWidth,
  name,
  nameColor = theme.itemTextDefaultColor,
  nameWidth,
  weakEntity,
}) => {
  const text = name ? name : weakEntity ? "Weak Entity" : "Entity";
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
        stroke={nameColor}
        strokeWidth={nameWidth || strokeWidth * 0.25}
        text={text}
        fontSize={theme.itemTextFontSize}
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

Entity.defaultProps = {
  width: 200,
  height: 100,
  stroke: theme.itemDefaultColor,
  strokeWidth: theme.itemStrokeDefaultWidth,
  nameColor: theme.itemTextDefaultColor,
};

export default Entity;
