import { Loading3QuartersOutlined } from "@ant-design/icons";
import { Row, Col, Button, Spin } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import networkServices from "../lib/network";
import styles from "../styles/navbar.module.css";
import UserAvatar from "./UserAvatar";
import { ReactComponent as Logo } from "../logo.svg";
import { useAppDispatch } from "../lib/hooks";

type Props = {
  dispatch: ReturnType<typeof useAppDispatch>;
};

const Navbar: React.FC<Props> = ({ dispatch }) => {
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
      <Col span={10} offset={2} className={styles.logoContainer}>
        <Link to="/" className={styles.logoLink}>
          <Logo title="Logo" className={styles.logo} />
        </Link>
      </Col>
      <Col span={10}>
        <div className={styles.end}>
          {isAuth === null ? (
            <Spin indicator={<Loading3QuartersOutlined />} spinning />
          ) : isAuth ? (
            <UserAvatar updateAuthState={setIsAuth} dispatch={dispatch} />
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
