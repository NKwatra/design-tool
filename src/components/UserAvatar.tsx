import { Dropdown, Menu, Avatar } from "antd";
import React from "react";
import { useHistory } from "react-router";

type Props = {
  updateAuthState: React.Dispatch<React.SetStateAction<boolean | null>>;
};

const UserAvatar: React.FC<Props> = ({ updateAuthState }) => {
  const history = useHistory();
  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      history.push("/dashboard");
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
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
      <Avatar style={{ cursor: "pointer" }}>
        {(localStorage.getItem("name") as string)[0].toUpperCase()}
      </Avatar>
    </Dropdown>
  );
};

export default UserAvatar;
