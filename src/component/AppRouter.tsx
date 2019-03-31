import * as React from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
import Home from "../module/dashboard/Home";

const About = React.lazy(() => import("../module/dashboard/About"));
const Readme = React.lazy(() => import("../module/dashboard/Readme"));

export class AppRouter extends React.PureComponent {
  public render() {
    return (
      <HashRouter>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/readme" component={Readme} />
        </Switch>
      </HashRouter>
    );
  }
}
