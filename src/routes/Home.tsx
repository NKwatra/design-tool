import * as React from "react";
import PageWrapper from "../components/PageWrapper";
import { useAppDispatch } from "../lib/hooks";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  return (
    <PageWrapper dispatch={dispatch}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        This will be the home page
      </div>
    </PageWrapper>
  );
};

export default Home;
