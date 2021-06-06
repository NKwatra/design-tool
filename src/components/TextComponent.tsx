import { Text } from "react-konva";
import * as React from "react";
import Draggable from "./Draggable";
import { DispatchType } from "../lib/hooks";
import theme from "../lib/theme";
import { IItem } from "../types/item";
import { KonvaEventObject } from "konva/types/Node";
import { updateItem } from "../redux/slice/diagram";

export type TextProps = {
  /** x position of the text */
  x: number;
  /** y position of the text */
  y: number;
  /** text to display */
  name: string;
  /** whether text is bold */
  bold?: boolean;
  /** whether the text is in italics */
  italic?: boolean;
  /** width of text wrapper */
  width?: number;
  /** height of text wrapper */
  height?: number;
  /** Id for the element */
  id: string;
  /** rotation of text element */
  rotation?: number;
  /** Redux dispatch function to be passed down */
  dispatch: DispatchType;
  /** font family for text element */
  fontFamily?: string;
  /** font size of the text element */
  fontSize?: number;
  /** whether the text element should be underlined */
  underlined?: boolean;
  /** color of text element */
  fill?: string;
  /** the currently selected item */
  selectedItem: IItem | null;
  /** handler for double click on text */
  handleDoubleClick: (
    e: KonvaEventObject<MouseEvent>,
    id?: string,
    text?: string
  ) => void;
  /** Whether text within it be visible */
  textVisible?: boolean;
};

const TextComponent: React.FC<TextProps> = ({
  x,
  y,
  name,
  bold,
  italic,
  width = 30,
  height = 20,
  id,
  rotation,
  dispatch,
  fontFamily = "Arial",
  fontSize = 14,
  underlined,
  fill = theme.itemTextDefaultColor,
  selectedItem,
  handleDoubleClick,
  textVisible = true,
}) => {
  let fontStyle = "";
  if (bold) {
    fontStyle += "bold";
  }
  if (italic) {
    fontStyle += " italic";
  }
  return (
    <Draggable
      x={x}
      y={y}
      width={width}
      height={height}
      id={id}
      type="text"
      rotation={rotation}
      dispatch={dispatch}
      isSelected={selectedItem?.item.id === id}
    >
      {textVisible && (
        <Text
          width={width}
          height={height}
          text={name}
          fontStyle={fontStyle}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textDecoration={underlined ? "underline" : undefined}
          fill={fill}
          ellipsis
          onDblClick={(e) => {
            e.cancelBubble = true;
            handleDoubleClick(e, id, name);
            dispatch(
              updateItem({
                id,
                updates: {
                  textVisible: false,
                },
              })
            );
          }}
        />
      )}
    </Draggable>
  );
};

TextComponent.defaultProps = {
  width: 150,
  height: 30,
  fontFamily: "Arial",
  fontSize: 14,
  fill: theme.itemTextDefaultColor,
  textVisible: true,
};

export default TextComponent;
