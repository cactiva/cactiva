import React from "react";
import { observer } from "mobx-react-lite";
import { useDragLayer, XYCoord } from "react-dnd";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%"
};

export default observer(() => {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    monitor => ({
      item: monitor.getItem(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging()
    })
  );

  if (!isDragging || !item || !item.node) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        <div
          className="singletag hover dragging"
          style={
            !!item.node.domRef
              ? {
                  width: item.node.domRef.offsetWidth,
                  height: Math.min(30, item.node.domRef.offsetHeight)
                }
              : {}
          }
        >
          {item.node.text}
        </div>
      </div>
    </div>
  );
});

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none"
    };
  }

  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}
