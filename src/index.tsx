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

const doRender = async () => {
  const React = await import("react");
  const ReactDOM = await import("react-dom");
  const { Application } = await import("./components/application/Application");

  const dom = (window as any).cactivaCanvasDom;
  if (dom) {
    if ((window as any).lastReactDOM) {
      (window as any).lastReactDOM.unmountComponentAtNode(dom);
    }
    (window as any).lastReactDOM = ReactDOM;
    ReactDOM.render(React.createElement(Application), dom);
  }
};

doRender();
