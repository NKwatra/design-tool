import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Dashboard from "./routes/Dashboard";
import Diagram from "./routes/Diagram";
import loader from "webfontloader";
import { availableFonts } from "./lib/constants";

function App() {
  React.useEffect(() => {
    loader.load({
      google: {
        families: availableFonts,
      },
    });
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/diagram">
          <Diagram />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
