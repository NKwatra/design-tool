import {
  Button,
  Drawer,
  Input,
  Layout,
  List,
  Modal,
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
import { ITEM_TYPES, PALLETE } from "../types/enums";
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
  GetDocumentSuccess,
  GetDocumentVersionsSuccess,
  SwitchVersionSuccess,
} from "../types/network";
import PageWrapper from "../components/PageWrapper";
import DocumentTitle from "../components/DocumentTitle";
import patchServices from "../lib/patch";
import { message } from "antd";
import { BiRefresh } from "react-icons/bi";
import { RiHistoryFill } from "react-icons/ri";
import Version from "../components/Version";
import Download from "../components/Download";

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
  onDrag: (id: string, updates: Partial<IItem["item"]>) => void,
  onDraw: (payload: { id: string; points: number[] }) => void
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
          onDraw={onDraw}
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
          onDraw={onDraw}
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
          onDraw={onDraw}
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
  /* 
    Select the items in diagram, versions, the item
    that is currently clicked, title of document and 
    current Drawing
  */
  const items = useAppSelector(selectDiagram);
  const versions = useAppSelector(selectVersions);
  const selectedItem = useAppSelector(selectItemCurrentlySelected);
  const currentDrawing = useAppSelector(selectCurrentDrawing);
  const title = useAppSelector(selectTitle);

  /* 
    To track if the complete document is loading
  */
  const [loading, setLoading] = React.useState(true);

  const [isDownload, setIsDownload] = React.useState(false);

  /* 
    To track the state of label and model
  */
  const [labelDetails, setLabelDetails] = React.useState({
    label: "",
    modalOpen: false,
  });

  /* 
    To track which of the color charts dropdown is open
    when the user changes color
  */
  const [colorOption, setColorOption] = React.useState<PALLETE | null>(null);

  /* 
    To track double click on an item as well as canvas
    so as to add text at place of click
  */
  const [doubleClickDetails, setDoubleClickDetails] =
    React.useState<DoubleClickDetails>({
      x: -1000,
      y: -1000,
      id: null,
      text: "",
    });

  /* 
    Get history object (to access id of current document),
    and redux dispatch
  */
  const dispatch = useAppDispatch();
  const history = useHistory<{ id: string }>();
  const {
    location: { state },
  } = history;

  /* 
    Used to track drawer for version and loading state
    of versions
  */
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [loadingVersions, setLoadingVersions] = React.useState(false);

  /*
    A reference to the stage/canvas element
  */
  const stageRef = React.useRef<StageType>(null);

  /* 
    To track status of document when commit is pressed
  */
  const [commitLoad, setCommitLoad] = React.useState(false);

  /* 
    Close the versions drawer
  */
  const handleDrawerClose = () => setDrawerOpen(false);

  /* 
    To convert the complete stage into PNG format
  */
  function convertToBase64(jpg?: boolean) {
    return new Promise<string>((resolve) => {
      stageRef.current?.toDataURL({
        mimeType: jpg ? "image/jpeg" : "image/png",
        callback: (image) => {
          resolve(image);
        },
      });
    });
  }

  async function downloadDocument(format: "png" | "jpeg" | "pdf") {
    setIsDownload(true);
    let base64Image: string;
    switch (format) {
      case "pdf":
      case "png":
        base64Image = await convertToBase64();
        break;
      case "jpeg":
        base64Image = await convertToBase64(true);
        break;
    }
    const result = await networkServices.downloadImage(
      base64Image,
      format,
      title
    );
    if (result.redirect) {
      history.replace("/login");
    }
    setIsDownload(false);
  }

  /* 
    Send data to server when commit button is pressed.
  */
  async function handleCommitPress(label: string) {
    const image = await convertToBase64();
    const data = {
      items,
    };
    setCommitLoad(true);
    const result = await networkServices.addCommit(
      state.id,
      data,
      image,
      label
    );
    if (result.redirect) {
      history.replace("/login");
    }
    setCommitLoad(false);
  }

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

  /* 
    For initial load of document from the backend
  */
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

  /* 
    To listen for clicks on the canvas
  */
  function checkDeselect(e: KonvaEventObject<MouseEvent>) {
    /* 
      If a connector is being drawn then current drawing will
      have a value
    */
    if (currentDrawing) {
      const { clientX, clientY } = e.evt;
      /* 
        Get the positions of click and signify that 
        user has stopped drawing and send patch to backend
      */
      handleEndDrawing({
        id: currentDrawing.id,
        points: [clientX - 182, clientY - 166],
      });
      dispatch(
        endDrawing({
          id: currentDrawing.id,
          points: [clientX - 182, clientY - 166],
        })
      );
    }
    /* 
      If some item is selected and stage is clicked at another
      place, deselect the item
    */
    let isDeselected = e.target === e.target.getStage();
    if (isDeselected) {
      dispatch(setSelectedItem(null));
    }
  }

  /*
    To respond to double click on canvas,
    id and text will have value if the click
    is on an existing item, otherwise it's
    a click on an empty place  
  */
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

  /* 
    To change UI if there was a double click
    previously and now the user has pressed enter
  */
  async function handleEnterPress() {
    const text = doubleClickDetails.text;
    const id = doubleClickDetails.id;
    /*
      If an already existing item, then update item
    */
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
      /* 
      else add the new text component into state
    */
      const patches = patchServices.generateAddPatch(items, {
        type: "text",
        item: {
          x: doubleClickDetails.x - 182,
          y: doubleClickDetails.y - 166,
          name: doubleClickDetails.text,
          id: Date.now().toString(),
        },
      });
      dispatch(
        addItem({
          type: "text",
          item: {
            x: doubleClickDetails.x - 182,
            y: doubleClickDetails.y - 166,
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

  /*
    Update the component state when text in textarea changes
  */
  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDoubleClickDetails((current) => ({ ...current, text: e.target.value }));
  }

  /* 
    Set the type of item being dragged from sidebar
  */
  function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
    let type = e.currentTarget.getAttribute("data-type") as ITEM_TYPES;
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
  }

  /* 
    Show copy effect when its is on canvas
  */
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }

  /* 
    To handle font size change of an existing item
  */
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

  /* 
    to change font family
  */
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

  /* To change fontStyle between bold, italic and underline */
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

  /* 
    To add item to state when the user drags an item
    from sidebar and releases it on canvas
  */
  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain") as ITEM_TYPES;
    /* 
      Get coordinates where item needs to be dropped
    */
    let { clientX, clientY } = e;
    clientX -= 182;
    clientY -= 166;
    let newItem = {
      item: { x: clientX, y: clientY, id: Date.now().toString() },
    } as IItem;
    /* 
      Add the new item to state depending upon the type of
      item that is added.
    */
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
    /* 
      add item to state and sync
    */
    const patches = patchServices.generateAddPatch(items, newItem);
    dispatch(addItem(newItem));
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  /* 
    Function to update text color when the text color changes
  */
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

  /* 
    Function to update item when background color changes
  */
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

  /* 
    function to update border color when the border color changes
  */
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

  /* 
    Function to update the end point of connector, 
    when it moves on the canvas
  */
  function handleMouseMove(e: KonvaEventObject<MouseEvent>) {
    const { clientX, clientY } = e.evt;
    if (currentDrawing) {
      dispatch(
        updatePoints({
          id: currentDrawing.id,
          points: [clientX - 182, clientY - 166],
        })
      );
    }
  }

  /* 
    function to sync new position of element when the element 
    is moved
  */
  async function applyDragPatches(id: string, updates: Partial<IItem["item"]>) {
    const patches = patchServices.generateUpdatePatch(items, id, updates);
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  /* 
    Function to send patch to backend user starts drawing a connector
  */
  async function handleStartDrawing(payload: { points: number[]; id: string }) {
    const patches = patchServices.generateStartDrawingPatch(items, payload);
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  /* 
    Function to send patch to backend user ends drawing a connector
  */
  async function handleEndDrawing(payload: { points: number[]; id: string }) {
    const patches = patchServices.generateEndDrawingPatch(items, payload);
    const hide = message.loading(loadingMessageConfig);
    const result = await networkServices.patchDocument(state.id, patches);
    hide();
    if (result.redirect) {
      history.replace("/login");
    }
  }

  /* 
    Open the pane and show version history
    when the button is clicked
  */
  async function handleHistoryClick() {
    setDrawerOpen(true);
    setLoadingVersions(true);
    const result = await networkServices.loadVersions(state.id);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as GetDocumentVersionsSuccess).versions) {
      dispatch(
        setVersions({
          id: state.id,
          versions: (result as GetDocumentVersionsSuccess).versions,
        })
      );
    }
    setLoadingVersions(false);
  }

  /* 
    Function to switch the version of the document
  */
  async function switchVersion(versionId: string) {
    const result = await networkServices.switchVersion(state.id, versionId);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as SwitchVersionSuccess).data) {
      dispatch(setItems((result as SwitchVersionSuccess).data.items));
      dispatch(setSelectedItem(null));
      setDrawerOpen(false);
    }
  }

  return loading ? (
    <div className={styles.loadingContainer}>
      <Spin indicator={<Loading3QuartersOutlined />} />
    </div>
  ) : (
    <PageWrapper hideFooter dispatch={dispatch}>
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
          title={<span className={styles.drawerHeader}>Version History</span>}
          headerStyle={{
            backgroundColor: "#131314",
            color: "#ffffff",
            borderTopLeftRadius: 38,
            borderBottom: "none",
          }}
          bodyStyle={{
            backgroundColor: "#131314",
            borderBottomLeftRadius: 38,
          }}
          closable={false}
          drawerStyle={{
            backgroundColor: "transparent",
          }}
          width={350}
        >
          {loadingVersions ? (
            <Spin indicator={<Loading3QuartersOutlined />} size="large" />
          ) : (
            <List
              dataSource={versions[state.id] || []}
              renderItem={(item) => (
                <Version {...item} onClick={switchVersion} />
              )}
              className={styles.versionsList}
            />
          )}
        </Drawer>
        <Layout className={styles.mainLayout}>
          <Header className={styles.mainLayoutHeader}>
            <Space size={24} className={styles.leftHeader}>
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
                  Icon={BsTypeBold}
                  onClick={() => handleBoldButtonClick("bold")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={
                    (selectedItem as Exclude<IItem, IConnector>)?.item?.italic
                  }
                  Icon={BsTypeItalic}
                  onClick={() => handleBoldButtonClick("italic")}
                />
                <RichTextOption
                  disabled={selectedItem === null}
                  active={
                    (selectedItem as Exclude<IItem, IConnector>)?.item
                      ?.underlined
                  }
                  Icon={BsTypeUnderline}
                  onClick={() => handleBoldButtonClick("underline")}
                />
              </Space>
              <Space style={{ display: "flex", alignItems: "center" }}>
                <ColorPicker
                  value={
                    (selectedItem as Exclude<IItem, IConnector | IText>)?.item
                      ?.nameColor || "#000000"
                  }
                  isOpen={colorOption === PALLETE.COLOR}
                  type={PALLETE.COLOR}
                  setIsOpen={setColorOption}
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
                  isOpen={colorOption === PALLETE.BACKGROUND}
                  type={PALLETE.BACKGROUND}
                  setIsOpen={setColorOption}
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
                  isOpen={colorOption === PALLETE.BORDER}
                  type={PALLETE.BORDER}
                  setIsOpen={setColorOption}
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
              <Download loading={isDownload} onDownload={downloadDocument} />
              <Button
                type="primary"
                onClick={() => setLabelDetails({ modalOpen: true, label: "" })}
                loading={commitLoad}
                className={styles.primaryButton}
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
                  color="#ffffff"
                />
              </Tooltip>
            </div>
          </Header>
          <Content onDragOver={handleDragOver} onDrop={handleDrop}>
            <Stage
              width={window.innerWidth - 232}
              height={window.innerHeight - 222}
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
                    applyDragPatches,
                    handleStartDrawing
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
      <Modal
        visible={labelDetails.modalOpen}
        onCancel={() => setLabelDetails({ modalOpen: false, label: "" })}
        onOk={() => {
          handleCommitPress(labelDetails.label);
          setLabelDetails({
            modalOpen: false,
            label: "",
          });
        }}
        okText="Add"
        centered
        okButtonProps={{
          disabled: labelDetails.label === "",
        }}
      >
        <Input
          placeholder="Label"
          value={labelDetails.label}
          onChange={(e) =>
            setLabelDetails((curr) => ({ ...curr, label: e.target.value }))
          }
          style={{ marginTop: 32, marginBottom: 16 }}
        />
      </Modal>
    </PageWrapper>
  );
};

export default Diagram;
