import * as React from "react";
import { hot } from "react-hot-loader/root";

declare var NODE_ENV: string;

const isDev = NODE_ENV === "development";
console.log("isDev: ", isDev);
const App = () => <div>Hello Worldxxxxxxxxxsdfsdfx!</div>;

export default isDev? hot(App) : App;
