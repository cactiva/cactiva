import { observer, useObservable } from "mobx-react-lite";
import { Callout, DirectionalHint } from "office-ui-fabric-react";
import React, { useRef } from "react";
import "./Popover.scss";
import { randStr } from "../../libs/utils";

interface IPopover {
  children: any;
  content: any;
  calloutProps?: any;
  onClickCapture?: (event: any) => void;
  onContextMenu?: (event: any) => void;
  visibleOnRightClick?: boolean;
}

export default observer(
  ({
    children,
    content,
    calloutProps,
    onClickCapture,
    onContextMenu,
    visibleOnRightClick
  }: IPopover) => {
    const meta = useObservable({
      visible: false
    });
    const id = randStr(15);
    const describe = `popover-${id}`;
    const childrenProps = {
      show: () => {
        meta.visible = true;
      },
      hide: () => {
        meta.visible = false;
      },
      ref: useRef(null as any)
    };
    return (
      <>
        {meta.visible && (
          <Callout
            target={childrenProps.ref.current}
            onDismiss={() => {
              meta.visible = false;
            }}
            ariaLabelledBy={id}
            ariaDescribedBy={describe}
            role="alertdialog"
            setInitialFocus={false}
            gapSpace={0}
            calloutWidth={60}
            directionalHint={DirectionalHint.topCenter}
            {...calloutProps}
          >
            <div className="monaco-breadcrumb-item">
              {typeof content === "function" ? content(childrenProps) : content}
            </div>
          </Callout>
        )}
        {typeof children === "function" ? (
          children(childrenProps)
        ) : (
          <div
            ref={childrenProps.ref}
            onClickCapture={(e: any) => {
              if (onClickCapture) {
                onClickCapture(e);
              }
              if (!visibleOnRightClick) {
                meta.visible = !meta.visible;
              }
              e.preventDefault();
              e.stopPropagation();
            }}
            onContextMenu={(e: any) => {
              if (onContextMenu) {
                onContextMenu(e);
              }
              if (!!visibleOnRightClick) {
                meta.visible = !meta.visible;
              }
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        )}
      </>
    );
  }
);
