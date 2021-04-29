import type { AttributeProps } from "../components/Attribute";
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

export type IItem = IEntity | IRelation | IAttribute;
