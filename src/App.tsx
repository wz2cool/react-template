import * as React from "react";
import { hot } from "react-hot-loader/root";
import { setConfig, cold } from "react-hot-loader";

declare var NODE_ENV: string;

const isDev = NODE_ENV === "development";

console.log("isDev: ", isDev);

if (isDev) {
  setConfig({
    pureSFC: true,
    onComponentRegister: (type, name, file) =>
      file.indexOf("node_modules") > 0 && cold(type),
    // some components are not visible as top level variables,
    // thus its not known where they were created
    onComponentCreate: (type, name) => name.indexOf("styled") > 0 && cold(type)
  });
}

const App = () => <div>Hello World!</div>;

export default (isDev ? hot(App) : App);
