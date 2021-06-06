import { Input, Typography } from "antd";
import React from "react";
import { useHistory } from "react-router";
import { useAppDispatch } from "../lib/hooks";
import networkServices from "../lib/network";
import { setTitle } from "../redux/slice/diagram";
import { UpdateDocumentSuccess } from "../types/network";

type Props = {
  /**
   * Title of the document
   */
  title: string;
  /**
   * id of the document
   */
  id: string;
};

const DocumentTitle: React.FC<Props> = ({ title, id }) => {
  const [editable, setEditable] = React.useState(false);
  const [value, setValue] = React.useState(title);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const handleTitleChange = (e: any) => setValue(e.target.value);

  const handleEnterPress = async () => {
    const result = await networkServices.updateDocument(value, id);
    if (result.redirect) {
      history.replace("/login");
    } else if ((result as UpdateDocumentSuccess).success) {
      setEditable(false);
      dispatch(setTitle(value));
    }
  };
  const handleDoubleClick = () => setEditable(true);

  return editable ? (
    <Input
      value={value}
      onChange={handleTitleChange}
      onPressEnter={handleEnterPress}
      autoFocus
      bordered={false}
    />
  ) : (
    <span onDoubleClick={handleDoubleClick}>
      <Typography.Title level={4} style={{ marginBottom: 0 }}>
        {title}
      </Typography.Title>
    </span>
  );
};

export default DocumentTitle;
