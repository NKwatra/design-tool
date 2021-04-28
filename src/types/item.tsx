import type { AttributeProps } from "../components/Attribute";
import type { EntityProps } from "../components/Entity";
import type { RelationProps } from "../components/Relation";

interface IEntity {
  type: "entity";
  item: EntityProps;
}

interface IRelation {
  type: "relation";
  item: RelationProps;
}

interface IAttribute {
  type: "attribute";
  item: AttributeProps;
}

export type IItem = IEntity | IRelation | IAttribute;
