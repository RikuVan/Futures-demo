// debug
if (process.env.NODE_ENV !== "development") {
  require("preact/devtools");
}

import { h, render } from "preact";
import App from "./App";
import createStore from "./store";
import { Provider } from "./store";

const initialState = {
  imagesIndex: null,
  breeds: [],
  letters: [],
  images: [],
  loading: false
};

export const store = createStore(initialState);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
