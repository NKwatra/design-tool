import type { AttributeProps } from "../components/Attribute";
import type { ConnectorProps } from "../components/Connector";
import type { EntityProps } from "../components/Entity";
import type { RelationProps } from "../components/Relation";
import type { TextProps } from "../components/TextComponent";

export interface IEntity {
  type: "entity";
  item: Omit<
    EntityProps,
    "dispatch" | "selectedItem" | "onDrag" | "handleDoubleClick"
  >;
}

export interface IRelation {
  type: "relation";
  item: Omit<
    RelationProps,
    "dispatch" | "selectedItem" | "onDrag" | "handleDoubleClick"
  >;
}

export interface IAttribute {
  type: "attribute";
  item: Omit<
    AttributeProps,
    "dispatch" | "selectedItem" | "onDrag" | "handleDoubleClick"
  >;
}

export interface IConnector {
  type: "connector";
  item: ConnectorProps;
}

export interface IText {
  type: "text";
  item: Omit<
    TextProps,
    "dispatch" | "selectedItem" | "onDrag" | "handleDoubleClick"
  >;
}

export type IItem = IEntity | IRelation | IAttribute | IConnector | IText;
