import { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Line } from "react-konva";
import theme from "../lib/theme";

export type ConnectorProps = {
  /** all the points on the line */
  points: number[];
  /** stroke width of the line */
  strokeWidth?: number;
  /** Fill color of line */
  stroke?: string;
  /** id of the item in redux store */
  id: string;
};

const Connector: React.FC<ConnectorProps> = ({
  points,
  strokeWidth = theme.itemStrokeDefaultWidth,
  stroke = theme.itemDefaultColor,
}) => {
  function handleMouseOver(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "all-scroll";
  }

  function handleMouseLeave(e: KonvaEventObject<MouseEvent>) {
    const container = e.target!.getStage()!.container();
    container.style.cursor = "default";
  }

  return (
    <Line
      points={points}
      strokeWidth={strokeWidth}
      stroke={stroke}
      draggable
      hitStrokeWidth={strokeWidth < 5 ? 3 * strokeWidth : strokeWidth}
      onMouseEnter={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    />
  );
};

Connector.defaultProps = {
  strokeWidth: theme.itemStrokeDefaultWidth,
  stroke: theme.itemDefaultColor,
};

export default Connector;
