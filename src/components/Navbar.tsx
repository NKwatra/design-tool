import { Row, Col, Button } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import styles from "../styles/navbar.module.css";

const Navbar: React.FC = () => {
  const history = useHistory();

  function handleLogin() {
    /* 
        Conditionally redirect to login or dashboard
    */
    history.push("/login");
  }

  return (
    <Row className={styles.container}>
      <Col span={10} offset={2}>
        <div>
          <img src="https://picsum.photos/50" alt="logo" />
        </div>
      </Col>
      <Col span={10}>
        <div className={styles.end}>
          <Button type="primary" onClick={handleLogin}>
            Sign In
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default Navbar;
