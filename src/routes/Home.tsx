import { Typography } from "antd";
import * as React from "react";
import { useHistory } from "react-router";
import styles from "../styles/home.module.css";

const Home: React.FC = () => {
  const history = useHistory();

  const getStarted = () => history.push("/login");

  return (
    <div className={styles.container}>
      <div className={styles.getStarted} onClick={getStarted}>
        Get Started
      </div>
      <Typography.Title className={styles.title}>LET'S DRAW</Typography.Title>
      <Typography.Title level={3} className={styles.description}>
        An easy to use tool to create flawless Entity Relation Diagrams. Create,
        Customise, Download diagrams effortlessly.
      </Typography.Title>
    </div>
  );
};

export default Home;
