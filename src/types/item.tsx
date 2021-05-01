import type { AttributeProps } from "../components/Attribute";
import { ConnectorProps } from "../components/Connector";
import type { EntityProps } from "../components/Entity";
import type { RelationProps } from "../components/Relation";

export interface IEntity {
  type: "entity";
  item: Omit<EntityProps, "dispatch" | "selectedItem">;
}

export interface IRelation {
  type: "relation";
  item: Omit<RelationProps, "dispatch" | "selectedItem">;
}

export interface IAttribute {
  type: "attribute";
  item: Omit<AttributeProps, "dispatch" | "selectedItem">;
}

export interface IConnector {
  type: "connector";
  item: ConnectorProps;
}

export type IItem = IEntity | IRelation | IAttribute | IConnector;
