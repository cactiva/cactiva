import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./components/application/Application";

(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: function() {},
  onCommitFiberRoot: function() {},
  onCommitFiberUnmount: function() {}
};

export function render(dom: HTMLElement) {
  (window as any).cactivaCanvasDom = dom;
  doRender();
}

const doRender = () => {
  const dom = (window as any).cactivaCanvasDom;
  if (dom) {
    if ((window as any).lastReactDOM) {
      (window as any).lastReactDOM.unmountComponentAtNode(dom);
    }
    (window as any).lastReactDOM = ReactDOM;
    ReactDOM.render(<Application />, dom);
  }
};

doRender();
