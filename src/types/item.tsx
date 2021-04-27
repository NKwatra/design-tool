import type { AttributeProps } from "../components/Attribute";
import type { EntityProps } from "../components/Entity";
import type { RelationProps } from "../components/Relation";

interface IEntity {
  type: "entity";
  item: EntityProps;
  id: string;
}

interface IRelation {
  type: "relation";
  item: RelationProps;
  id: string;
}

interface IAttribute {
  type: "attribute";
  item: AttributeProps;
  id: string;
}

export type IItem = IEntity | IRelation | IAttribute;
