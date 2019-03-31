import * as React from "react";
import { Route, HashRouter } from "react-router-dom";
import { Home } from "../module/dashboard/Home";
import { About } from "../module/dashboard/About";
import { Readme } from "../module/dashboard/Readme";

export class AppRouter extends React.PureComponent {
  public render() {
    return (
      <HashRouter>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/readme" component={Readme} />
      </HashRouter>
    );
  }
}
