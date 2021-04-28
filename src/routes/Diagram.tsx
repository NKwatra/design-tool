import { Layout } from "antd";
import { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import Attribute from "../components/Attribute";
import Entity from "../components/Entity";
import Relation from "../components/Relation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  selectDiagram,
  selectItemCurrentlySelected,
  setSelectedItem,
} from "../redux/slice/diagram";
import type { IItem } from "../types/item";
import styles from "../styles/diagram.module.css";

const { Header, Sider, Content } = Layout;

function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const renderItem = (
  item: IItem,
  dispatch: ReturnType<typeof useAppDispatch>,
  selectedItem: IItem | null
) => {
  switch (item.type) {
    case "entity":
      return (
        <Entity
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
        />
      );
    case "attribute":
      return (
        <Attribute
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
        />
      );
    case "relation":
      return (
        <Relation
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
        />
      );
    default:
      return assertNever(item);
  }
};

const Diagram: React.FC = () => {
  const items = useAppSelector(selectDiagram);
  const selectedItem = useAppSelector(selectItemCurrentlySelected);
  const dispatch = useAppDispatch();

  function checkDeselect(e: KonvaEventObject<MouseEvent>) {
    let isDeselected = e.target === e.target.getStage();
    if (isDeselected) {
      dispatch(setSelectedItem(null));
    }
  }

  return (
    <>
      <Layout>
        <Sider className={styles.sider}>I Am a sider</Sider>
        <Layout className={styles.mainLayout}>
          <Header className={styles.mainLayoutHeader}>I am the header</Header>
          <Content>
            <Stage
              width={window.innerWidth - 232}
              height={window.innerHeight - 102}
              onMouseDown={checkDeselect}
              className={styles.canvasContainer}
            >
              <Layer>
                {items.map((item) => renderItem(item, dispatch, selectedItem))}
              </Layer>
            </Stage>
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default Diagram;
