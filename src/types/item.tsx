import type { AttributeProps } from "../components/Attribute";
import type { EntityProps } from "../components/Entity";
import type { RelationProps } from "../components/Relation";

interface IEntity {
  type: "entity";
  item: Omit<EntityProps, "dispatch">;
}

interface IRelation {
  type: "relation";
  item: Omit<RelationProps, "dispatch">;
}

interface IAttribute {
  type: "attribute";
  item: Omit<AttributeProps, "dispatch">;
}

export type IItem = IEntity | IRelation | IAttribute;
