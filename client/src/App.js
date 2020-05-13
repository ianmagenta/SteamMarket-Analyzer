import React from "react";
import ResponsiveDrawer from "./components/ResponsiveDrawer";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Route exact path="/">
        <Redirect to="/snapshot" />
      </Route>
      <ResponsiveDrawer />
    </BrowserRouter>
  );
}

export default App;
