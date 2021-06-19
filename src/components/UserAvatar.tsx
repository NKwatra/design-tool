import { Dropdown, Menu, Avatar } from "antd";
import React from "react";
import { useHistory } from "react-router";
import { useAppDispatch } from "../lib/hooks";
import { resetState as resetDiagram } from "../redux/slice/diagram";
import { resetState as resetUser } from "../redux/slice/user";

type Props = {
  updateAuthState: React.Dispatch<React.SetStateAction<boolean | null>>;
  dispatch: ReturnType<typeof useAppDispatch>;
};

const UserAvatar: React.FC<Props> = ({ updateAuthState, dispatch }) => {
  const history = useHistory();
  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      history.push("/dashboard");
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
      dispatch(resetDiagram());
      dispatch(resetUser());
      updateAuthState(false);
      history.replace("/");
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        <span>My Dashboard</span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2">
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Avatar
        style={{
          cursor: "pointer",
          background:
            "linear-gradient(92.51deg, #CD5C5C 9.95%, #FF7F50 66.6%, #F08080 127.08%)",
        }}
      >
        {(localStorage.getItem("name") as string)[0].toUpperCase()}
      </Avatar>
    </Dropdown>
  );
};

export default UserAvatar;
