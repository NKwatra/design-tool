import {
  Button,
  Drawer,
  Input,
  Layout,
  List,
  Space,
  Spin,
  Tooltip,
} from "antd";
import { KonvaEventObject } from "konva/types/Node";
import * as React from "react";
import { Layer, Stage } from "react-konva";
import type { Stage as StageType } from "konva/types/Stage";
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
  selectVersions,
  setVersions,
} from "../redux/slice/diagram";
import type {
  IAttribute,
  IConnector,
  IEntity,
  IItem,
  IRelation,
  IText,
} from "../types/item";
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
import {
  CommitDocSuccess,
  GetDocumentSuccess,
  GetDocumentVersionsSuccess,
} from "../types/network";
import PageWrapper from "../components/PageWrapper";
import DocumentTitle from "../components/DocumentTitle";
import patchServices from "../lib/patch";
import { message } from "antd";
import { BiRefresh } from "react-icons/bi";
import { RiHistoryFill } from "react-icons/ri";
import Version from "../components/Version";

const { Header, Sider, Content } = Layout;

message.config({
  maxCount: 3,
  top: 80,
});

export const loadingMessageConfig = {
  content: "Synching",
  duration: 0,
  icon: <BiRefresh style={{ marginRight: 8 }} />,
};

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
  ) => void,
  onDrag: (id: string, updates: Partial<IItem["item"]>) => void
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
          onDrag={onDrag}
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
          onDrag={onDrag}
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
          onDrag={onDrag}
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
          onDrag={onDrag}
        />
      );
    default:
      return assertNever(item);
  }
};

const Diagram: React.FC = () => {
  const items = useAppSelector(selectDiagram);
  const versions = useAppSelector(selectVersions);
  const selectedItem = useAppSelector(selectItemCurrentlySelected);
  const currentDrawing = useAppSelector(selectCurrentDrawing);
  const [loading, setLoading] = React.useState(true);
  const dispatch = useAppDispatch();
  const history = useHistory<{ id: string }>();
  const title = useAppSelector(selectTitle);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loadingVersions, setLoadingVersions] = React.useState(false);
  const {
    location: { state },
  } = history;
  const stageRef = React.useRef<StageType>(null);
  const [commitLoad, setCommitLoad] = React.useState(false);

  const handleDrawerClose = () => setDrawerOpen(false);

  function convertToPng() {
    return new Promise<string>((resolve) => {
      stageRef.current?.toDataURL({
        mimeType: "image/png",
        callback: (image) => {
          resolve(image);
        },
      });
    });
  }

  async function handleCommitPress() {
    const image = await convertToPng();
    const data = {
      items,
    };
    setCommitLoad(true);
    const result = await networkServices.addCommit(state.id, data, image);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as CommitDocSuccess).version && versions.length !== 0) {
      setVersions([(result as CommitDocSuccess).version, ...versions]);
    }
    setCommitLoad(false);
  }

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
    async function handleKeyPress(e: KeyboardEvent) {
      if (e.key === "Backspace" && e.ctrlKey && selectedItem) {
        const patches = patchServices.generateRemovePatch(
          items,
          selectedItem.item.id
        );
        dispatch(removeItem(selectedItem.item.id));
        const hide = message.loading(loadingMessageConfig);
        const result = await networkServices.patchDocument(state.id, patches);
        hide();
        if (result.redirect) {
          history.replace("/login");
        }
      }
    }
    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedItem, dispatch, items, state.id, history]);

  React.useEffect(() => {
    const id = state.id;
    async function loadDiagram() {
      const result = await networkServices.getDocument(id);
      if (result.redirect) {
        history.replace("/login");
      } else if ((result as GetDocumentSuccess).title) {
        dispatch(setTitle((result as GetDocumentSuccess).title));
        dispatch(setItems((result as GetDocumentSuccess).data!.items));
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

  async function handleEnterPress() {
    const text = doubleClickDetails.text;
    const id = doubleClickDetails.id;
    if (id) {
      const patches = patchServices.generateUpdatePatch(items, id, {
        name: text,
        textVisible: true,
      });
      dispatch(updateItem({ id, updates: { name: text, textVisible: true } }));
      const hide = message.loading(loadingMessageConfig);
      const result = await networkServices.patchDocument(state.id, patches);
      hide();
      if (result.redirect) {
        history.replace("/login");
      }
    } else {
      const patches = patchServices.generateAddPatch(items, {
        type: "text",
        item: {
          x: doubleClickDetails.x - 166,
          y: doubleClickDetails.y - 86,
          name: doubleClickDetails.text,
          id: Date.now().toString(),
        },
      });
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
      const hide = message.loading(loadingMessageConfig);
      const result = await networkServices.patchDocument(state.id, patches);
      hide();
      if (result.redirect) {
        history.replace("/login");
      }
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

  async function handleFontSizeChange(value: number) {
    const patches = patchServices.generateUpdatePatch(
      items,
      selectedItem!.item!.id,
      { fontSize: value }
    );
    dispatch(
      updateItem({ id: selectedItem!.item!.id, updates: { fontSize: value } })
    );
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }
  async function handleFontFamilyChange(value: string) {
    const patches = patchServices.generateUpdatePatch(
      items,
      selectedItem!.item!.id,
      { fontFamily: value }
    );
    dispatch(
      updateItem({ id: selectedItem!.item!.id, updates: { fontFamily: value } })
    );
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  async function handleBoldButtonClick(
    operation: "bold" | "italic" | "underline"
  ) {
    let patches: any[];
    switch (operation) {
      case "bold":
        patches = patchServices.generateUpdatePatch(
          items,
          selectedItem!.item!.id,
          { bold: !(selectedItem as Exclude<IItem, IConnector>)!.item?.bold }
        );
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              bold: !(selectedItem as Exclude<IItem, IConnector>)!.item?.bold,
            },
          })
        );
        break;
      case "italic":
        patches = patchServices.generateUpdatePatch(
          items,
          selectedItem!.item!.id,
          {
            italic: !(selectedItem as Exclude<IItem, IConnector>)!.item?.italic,
          }
        );
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              italic: !(selectedItem as Exclude<IItem, IConnector>)!.item
                ?.italic,
            },
          })
        );
        break;
      case "underline":
        patches = patchServices.generateUpdatePatch(
          items,
          selectedItem!.item!.id,
          {
            underlined: !(selectedItem as Exclude<IItem, IConnector>)!.item
              ?.underlined,
          }
        );
        dispatch(
          updateItem({
            id: selectedItem!.item!.id,
            updates: {
              underlined: !(selectedItem as Exclude<IItem, IConnector>)!.item
                ?.underlined,
            },
          })
        );
        break;
      default:
        return assertNever(operation);
    }
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
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
    const patches = patchServices.generateAddPatch(items, newItem);
    dispatch(addItem(newItem));
    // const hide = message.loading(loadingMessageConfig)
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    // hide()
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  async function handleTextColorChange(newColor: string) {
    const patches = patchServices.generateUpdatePatch(
      items,
      selectedItem!.item!.id,
      { nameColor: newColor }
    );
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          nameColor: newColor,
        },
      })
    );
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  async function handleFillColorChange(newColor: string) {
    const patches = patchServices.generateUpdatePatch(
      items,
      selectedItem!.item!.id,
      { fillColor: newColor }
    );
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          fillColor: newColor,
        },
      })
    );
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }
  async function handleStrokeColorChange(newColor: string) {
    const patches = patchServices.generateUpdatePatch(
      items,
      selectedItem!.item!.id,
      { stroke: newColor }
    );
    dispatch(
      updateItem({
        id: selectedItem!.item!.id,
        updates: {
          stroke: newColor,
        },
      })
    );
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
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

  async function applyDragPatches(id: string, updates: Partial<IItem["item"]>) {
    const patches = patchServices.generateUpdatePatch(items, id, updates);
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  async function handleHistoryClick() {
    setDrawerOpen(true);
    if (versions.length === 0) {
      setLoadingVersions(true);
      const result = await networkServices.loadVersions(state.id);
      if (result.redirect) {
        history.replace("/login");
      } else if ((result as GetDocumentVersionsSuccess).versions) {
        dispatch(setVersions((result as GetDocumentVersionsSuccess).versions));
      }
      setLoadingVersions(false);
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
        <Drawer
          placement="right"
          onClose={handleDrawerClose}
          visible={drawerOpen}
          title="Version History"
        >
          {loadingVersions ? (
            <Spin indicator={<Loading3QuartersOutlined />} size="large" />
          ) : (
            <List
              dataSource={versions}
              renderItem={(item) => <Version {...item} />}
            />
          )}
        </Drawer>
        <Layout className={styles.mainLayout}>
          <Header className={styles.mainLayoutHeader}>
            <Space size={24}>
              <DocumentTitle title={title} id={state.id} />
              <Space>
                <FontFamily
                  value={
                    (selectedItem as Exclude<IItem, IConnector>)?.item
                      ?.fontFamily || "Arial"
                  }
                  disabled={selectedItem === null}
                  onChange={handleFontFamilyChange}
                />
                <FontSize
                  value={
                    (selectedItem as Exclude<IItem, IConnector>)?.item
                      ?.fontSize || theme.itemTextFontSize
                  }
                  disabled={selectedItem === null}
                  onChange={handleFontSizeChange}
                />
              </Space>
              <Space>
                <RichTextOption
                  disabled={selectedItem === null}
                  active={
                    (selectedItem as Exclude<IItem, IConnector>)?.item?.bold
                  }
                  icon={<BsTypeBold />}
                  onClick={() => handleBoldButtonClick("bold")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={
                    (selectedItem as Exclude<IItem, IConnector>)?.item?.italic
                  }
                  icon={<BsTypeItalic />}
                  onClick={() => handleBoldButtonClick("italic")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={
                    (selectedItem as Exclude<IItem, IConnector>)?.item
                      ?.underlined
                  }
                  icon={<BsTypeUnderline />}
                  onClick={() => handleBoldButtonClick("underline")}
                />
              </Space>
              <Space style={{ display: "flex", alignItems: "center" }}>
                <ColorPicker
                  value={
                    (selectedItem as Exclude<IItem, IConnector | IText>)?.item
                      ?.nameColor || "#000000"
                  }
                  onChange={handleTextColorChange}
                  icon={
                    <MdFormatColorText
                      color={
                        (selectedItem as Exclude<IItem, IConnector | IText>)
                          ?.item?.nameColor || "#000000"
                      }
                      size={20}
                    />
                  }
                  disabled={selectedItem === null}
                  title="Color"
                />
                <ColorPicker
                  value={
                    (selectedItem as Exclude<IItem, IConnector | IText>)?.item
                      ?.fillColor || "transparent"
                  }
                  disabled={selectedItem === null}
                  icon={
                    <MdColorize
                      color={
                        (selectedItem as Exclude<IItem, IConnector | IText>)
                          ?.item?.fillColor || "#000000"
                      }
                      size={20}
                    />
                  }
                  onChange={handleFillColorChange}
                  title="Fill Color"
                />
                <ColorPicker
                  value={
                    (selectedItem as Exclude<IItem, IConnector | IText>)?.item
                      ?.stroke || theme.itemDefaultColor
                  }
                  disabled={selectedItem === null}
                  icon={
                    <MdBorderColor
                      color={
                        (selectedItem as Exclude<IItem, IConnector | IText>)
                          ?.item?.stroke || theme.itemDefaultColor
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
            <div className={styles.rightHeader}>
              <Button
                type="primary"
                onClick={handleCommitPress}
                loading={commitLoad}
              >
                Commit
              </Button>
              <Tooltip
                title="Version History"
                color={theme.tooltipBackgroundColor}
              >
                <RiHistoryFill
                  size={20}
                  className={styles.tooltip}
                  onClick={handleHistoryClick}
                />
              </Tooltip>
            </div>
          </Header>
          <Content onDragOver={handleDragOver} onDrop={handleDrop}>
            <Stage
              width={window.innerWidth - 232}
              height={window.innerHeight - 172}
              onMouseDown={checkDeselect}
              className={styles.canvasContainer}
              onDblClick={handleDoubleClickOnCanvas}
              onMouseMove={handleMouseMove}
              ref={stageRef}
            >
              <Layer>
                {items.map((item) =>
                  renderItem(
                    item,
                    dispatch,
                    selectedItem,
                    handleDoubleClickOnCanvas,
                    applyDragPatches
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
