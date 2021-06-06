// @ts-nocheck
import { Input, Layout, Space, Spin } from "antd";
import { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import Attribute from "../components/Attribute";
import Entity from "../components/Entity";
import Relation from "../components/Relation";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import {
  addItem,
  endDrawing,
  removeItem,
  selectCurrentDrawing,
  selectDiagram,
  selectItemCurrentlySelected,
  setItems,
  setSelectedItem,
  updateItem,
  updatePoints,
  setTitle,
  selectTitle,
} from "../redux/slice/diagram";
import type { IAttribute, IEntity, IItem, IRelation } from "../types/item";
import styles from "../styles/diagram.module.css";
import { ITEM_TYPES } from "../types/enums";
import FontSize from "../components/FontSize";
import theme from "../lib/theme";
import RichTextOption from "../components/RichTextOption";
import { BsTypeBold, BsTypeItalic, BsTypeUnderline } from "react-icons/bs";
import FontFamily from "../components/FontFamily";
import ColorPicker from "../components/ColorPicker";
import { MdFormatColorText, MdColorize, MdBorderColor } from "react-icons/md";
import Connector from "../components/Connector";
import TextComponent from "../components/TextComponent";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import networkServices from "../lib/network";
import { GetDocumentSuccess } from "../types/network";
import { useSelector } from "react-redux";
import PageWrapper from "../components/PageWrapper";
import DocumentTitle from "../components/DocumentTitle";

const { Header, Sider, Content } = Layout;

type DoubleClickDetails = {
  x: number;
  y: number;
  id: string | null;
  text: string;
};

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

const renderItem = (
  item: IItem,
  dispatch: ReturnType<typeof useAppDispatch>,
  selectedItem: IItem | null,
  handleDoubleClick: (
    e: KonvaEventObject<MouseEvent>,
    id?: string,
    text?: string
  ) => void
) => {
  switch (item.type) {
    case "entity":
      return (
        <Entity
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
          handleDoubleClick={handleDoubleClick}
        />
      );
    case "attribute":
      return (
        <Attribute
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
          handleDoubleClick={handleDoubleClick}
        />
      );
    case "relation":
      return (
        <Relation
          {...item.item}
          key={item.item.id}
          dispatch={dispatch}
          selectedItem={selectedItem}
          handleDoubleClick={handleDoubleClick}
        />
      );
    case "connector":
      return <Connector key={item.item.id} {...item.item} />;
    case "text":
      return (
        <TextComponent
          key={item.item.id}
          {...item.item}
          dispatch={dispatch}
          selectedItem={selectedItem}
          handleDoubleClick={handleDoubleClick}
        />
      );
    default:
      return assertNever(item);
  }
};

const Diagram: React.FC = () => {
  const items = useAppSelector(selectDiagram);
  const selectedItem = useAppSelector(selectItemCurrentlySelected);
  const currentDrawing = useAppSelector(selectCurrentDrawing);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const title = useSelector(selectTitle);
  const {
    location: { state },
  } = history;

  const [doubleClickDetails, setDoubleClickDetails] =
    React.useState<DoubleClickDetails>({
      x: -1000,
      y: -1000,
      id: null,
      text: "",
    });

  /* 
    Listen for Ctrl + delete key and remove select item 
  */
  React.useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Backspace" && e.ctrlKey && selectedItem) {
        dispatch(removeItem(selectedItem.item.id));
      }
    }
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedItem, dispatch]);

  React.useEffect(() => {
    const id = state.id;
    async function loadDiagram() {
      const result = await networkServices.getDocument(id);
      if (result.redirect) {
        history.replace("/login");
      } else if ((result as GetDocumentSuccess).title) {
        dispatch(setTitle(result!.title));
        dispatch(setItems(result!.data!.items));
        setLoading(false);
      }
    }

    loadDiagram();
  }, [state.id, history, dispatch]);

  function checkDeselect(e: KonvaEventObject<MouseEvent>) {
    if (currentDrawing) {
      const { clientX, clientY } = e.evt;
      dispatch(
        endDrawing({
          id: currentDrawing.id,
          points: [clientX - 166, clientY - 86],
        })
      );
    }
    let isDeselected = e.target === e.target.getStage();
    if (isDeselected) {
      dispatch(setSelectedItem(null));
    }
  }

  function handleDoubleClickOnCanvas(
    e: KonvaEventObject<MouseEvent>,
    id?: string,
    text?: string
  ) {
    const { clientX, clientY } = e.evt;
    setDoubleClickDetails({
      x: clientX,
      y: clientY,
      id: id ? id : null,
      text: text || "",
    });
  }

  function handleEnterPress() {
    const text = doubleClickDetails.text;
    const id = doubleClickDetails.id;
    if (id) {
      dispatch(updateItem({ id, updates: { name: text, textVisible: true } }));
    } else {
      dispatch(
        addItem({
          type: "text",
          item: {
            x: doubleClickDetails.x - 166,
            y: doubleClickDetails.y - 86,
            name: doubleClickDetails.text,
            id: Date.now().toString(),
          },
        })
      );
    }
    setDoubleClickDetails({ x: -1000, y: -1000, id: null, text: "" });
  }

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDoubleClickDetails((current) => ({ ...current, text: e.target.value }));
  }

  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    let type = e.currentTarget.getAttribute("data-type") as ITEM_TYPES;
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  function handleFontSizeChange(value: number) {
    dispatch(
      updateItem({ id: selectedItem!.item!.id, updates: { fontSize: value } })
    );
  }
  function handleFontFamilyChange(value: string) {
    dispatch(
      updateItem({ id: selectedItem!.item!.id, updates: { fontFamily: value } })
    );
  }

  function handleBoldButtonClick(operation: "bold" | "italic" | "underline") {
    switch (operation) {
      case "bold":
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              bold: !selectedItem!.item?.bold,
            },
          })
        );
        break;
      case "italic":
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              italic: !selectedItem!.item?.italic,
            },
          })
        );
        break;
      case "underline":
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              underlined: !selectedItem!.item?.underlined,
            },
          })
        );
        break;
      default:
        return assertNever(operation);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain") as ITEM_TYPES;
    let { clientX, clientY } = e;
    clientX -= 166;
    clientY -= 86;
    let newItem = {
      item: { x: clientX, y: clientY, id: Date.now().toString() },
    } as IItem;
    switch (item) {
      case ITEM_TYPES.ENTITY:
        newItem.type = "entity";
        break;
      case ITEM_TYPES.WEAK_ENTITY:
        newItem.type = "entity";
        (newItem.item as IEntity["item"]).weakEntity = true;
        break;
      case ITEM_TYPES.WEAK_RELATION:
        newItem.type = "relation";
        (newItem.item as IRelation["item"]).identifying = true;
        break;
      case ITEM_TYPES.RELATION:
        newItem.type = "relation";
        break;
      case ITEM_TYPES.ATTRIBUTE:
        newItem.type = "attribute";
        break;
      case ITEM_TYPES.MULTIVALUED_ATTRIBUTE:
        newItem.type = "attribute";
        (newItem.item as IAttribute["item"]).type = "multivalued";
        break;
      case ITEM_TYPES.DERIVED_ATTRIBUTE:
        newItem.type = "attribute";
        (newItem.item as IAttribute["item"]).type = "derived";
    }
    dispatch(addItem(newItem));
  }

  function handleTextColorChange(newColor: string) {
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          nameColor: newColor,
        },
      })
    );
  }

  function handleFillColorChange(newColor: string) {
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          fillColor: newColor,
        },
      })
    );
  }
  function handleStrokeColorChange(newColor: string) {
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          stroke: newColor,
        },
      })
    );
  }

  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const { clientX, clientY } = e.evt;
    if (currentDrawing) {
      dispatch(
        updatePoints({
          id: currentDrawing.id,
          points: [clientX - 166, clientY - 86],
        })
      );
    }
  }

  return loading ? (
    <div className={styles.loadingContainer}>
      <Spin indicator={<Loading3QuartersOutlined />} />
    </div>
  ) : (
    <PageWrapper hideFooter>
      <Layout style={{ marginTop: "-0.9rem" }}>
        <Sider className={styles.sider}>
          <div
            className={`${styles.entity} ${styles.pointer} ${styles.itemGrayBackground}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.ENTITY}
          >
            <span>Entity</span>
          </div>
          <div
            className={`${styles.entity} ${styles.pointer} ${styles.itemGrayBackground}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.WEAK_ENTITY}
          >
            <div className={styles.weakEntity}>
              <span>Weak Entity</span>
            </div>
          </div>
          <div
            className={`${styles.relation} ${styles.pointer} ${styles.itemGrayBackground}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.RELATION}
          >
            <span className={styles.transformedText}>Relation</span>
          </div>
          <div
            className={`${styles.relation} ${styles.pointer} ${styles.itemGrayBackground} ${styles.larger}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.WEAK_RELATION}
          >
            <div className={`${styles.weakRelation}`}>
              <span className={styles.transformedText}> Weak Relation</span>
            </div>
          </div>
          <div
            className={`${styles.attribute} ${styles.pointer} ${styles.itemGrayBackground}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.ATTRIBUTE}
          >
            <span>Attribute</span>
          </div>
          <div
            className={`${styles.attribute} ${styles.pointer} ${styles.itemGrayBackground}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.MULTIVALUED_ATTRIBUTE}
          >
            <div className={styles.multiValued}>
              <span className={styles.textCenter}>Multivalued Attribute</span>
            </div>
          </div>
          <div
            className={`${styles.attribute} ${styles.pointer} ${styles.itemGrayBackground} ${styles.derived}`}
            draggable
            onDragStart={handleDragStart}
            data-type={ITEM_TYPES.DERIVED_ATTRIBUTE}
          >
            <span className={styles.textCenter}>
              Derived <br /> Attribute
            </span>
          </div>
        </Sider>
        <Layout className={styles.mainLayout}>
          <Header className={styles.mainLayoutHeader}>
            <Space size={24}>
              <DocumentTitle title={title} id={state.id} />
              <Space>
                <FontFamily
                  value={selectedItem?.item?.fontFamily || "Arial"}
                  disabled={selectedItem === null}
                  onChange={handleFontFamilyChange}
                />
                <FontSize
                  value={selectedItem?.item?.fontSize || theme.itemTextFontSize}
                  disabled={selectedItem === null}
                  onChange={handleFontSizeChange}
                />
              </Space>
              <Space>
                <RichTextOption
                  disabled={selectedItem === null}
                  active={selectedItem?.item?.bold}
                  icon={<BsTypeBold />}
                  onClick={() => handleBoldButtonClick("bold")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={selectedItem?.item?.italic}
                  icon={<BsTypeItalic />}
                  onClick={() => handleBoldButtonClick("italic")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={selectedItem?.item?.underlined}
                  icon={<BsTypeUnderline />}
                  onClick={() => handleBoldButtonClick("underline")}
                />
              </Space>
              <Space style={{ display: "flex", alignItems: "center" }}>
                <ColorPicker
                  value={selectedItem?.item?.nameColor || "#000000"}
                  onChange={handleTextColorChange}
                  icon={
                    <MdFormatColorText
                      color={selectedItem?.item?.nameColor || "#000000"}
                      size={20}
                    />
                  }
                  disabled={selectedItem === null}
                  title="Color"
                />
                <ColorPicker
                  value={selectedItem?.item?.fillColor || "transparent"}
                  disabled={selectedItem === null}
                  icon={
                    <MdColorize
                      color={selectedItem?.item?.fillColor || "#000000"}
                      size={20}
                    />
                  }
                  onChange={handleFillColorChange}
                  title="Fill Color"
                />
                <ColorPicker
                  value={selectedItem?.item?.stroke || theme.itemDefaultColor}
                  disabled={selectedItem === null}
                  icon={
                    <MdBorderColor
                      color={
                        selectedItem?.item?.stroke || theme.itemDefaultColor
                      }
                      size={20}
                      style={{ marginTop: 8 }}
                    />
                  }
                  onChange={handleStrokeColorChange}
                  title="Border Color"
                />
              </Space>
            </Space>
          </Header>
          <Content onDragOver={handleDragOver} onDrop={handleDrop}>
            <Stage
              width={window.innerWidth - 232}
              height={window.innerHeight - 172}
              onMouseDown={checkDeselect}
              className={styles.canvasContainer}
              onDblClick={handleDoubleClickOnCanvas}
              onMouseMove={handleMouseMove}
            >
              <Layer>
                {items.map((item) =>
                  renderItem(
                    item,
                    dispatch,
                    selectedItem,
                    handleDoubleClickOnCanvas
                  )
                )}
              </Layer>
            </Stage>
            {doubleClickDetails.x > 0 && (
              <Input.TextArea
                defaultValue={doubleClickDetails.text}
                autoSize
                autoFocus
                bordered={false}
                style={{
                  position: "fixed",
                  zIndex: 1,
                  left: doubleClickDetails.x - 10,
                  top: doubleClickDetails.y - 10,
                  width: 300,
                }}
                onPressEnter={handleEnterPress}
                onBlur={handleEnterPress}
                onChange={handleTextAreaChange}
                value={doubleClickDetails.text}
              />
            )}
          </Content>
        </Layout>
      </Layout>
    </PageWrapper>
  );
};

export default Diagram;
