import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Row, Col, Button, Spin } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import networkServices from "../lib/network";
import styles from "../styles/navbar.module.css";
import UserAvatar from "./UserAvatar";

const Navbar: React.FC = () => {
  const history = useHistory();
  const [isAuth, setIsAuth] = React.useState<boolean | null>(null);

  function handleLogin() {
    /* 
        Conditionally redirect to login or dashboard
    */
    history.push("/login");
  }

  React.useEffect(() => {
    async function checkAuth() {
      const authStatus = await networkServices.verifyAuth();
      setIsAuth(authStatus);
    }
    checkAuth();
  }, []);

  return (
    <Row className={styles.container}>
      <Col span={10} offset={2}>
        <Link to="/">
          <img src="https://picsum.photos/50" alt="logo" />
        </Link>
      </Col>
      <Col span={10}>
        <div className={styles.end}>
          {isAuth === null ? (
            <Spin indicator={<Loading3QuartersOutlined />} />
          ) : isAuth ? (
            <UserAvatar updateAuthState={setIsAuth} />
          ) : (
            <Button type="primary" onClick={handleLogin}>
              Sign In
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default Navbar;
