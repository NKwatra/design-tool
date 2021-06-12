import * as React from "react";
import PageWrapper from "../components/PageWrapper";

const Home: React.FC = () => {
  return (
    <PageWrapper>
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
