(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: function() {},
  onCommitFiberRoot: function() {},
  onCommitFiberUnmount: function() {}
};

export const init = async () => {
  const React = await import("react");
  const ReactDOM = await import("react-dom");
  const { Editor } = await import("./Editor/Editor");
  const { cactiva, CactivaWorker } = await import("./models/store");
  const { observable, toJS } = await import("mobx");
  const { observer } = await import("mobx-react-lite");
  const EditorCanvas = await (await import("./models/EditorCanvas")).default;
  const EditorSource = await (await import("./models/EditorSource")).default;
  const Canvas = observer(({ canvas }: any) => {
    if (!canvas.root) {
      return null;
    }
    return <Editor canvas={canvas.root} />;
  });
  return {
    React,
    ReactDOM,
    CactivaWorker,
    toJS,
    EditorSource,
    EditorCanvas,
    observable,
    Canvas,
    cactiva
  };
};
