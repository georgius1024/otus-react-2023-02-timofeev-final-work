import { PropsWithChildren, useRef, useEffect } from "react";
import classNames from "classnames";
import "@/components/SidePanel.scss";

type OnClose = () => void;

type SidePanelProps = {
  show: boolean;
  position?: "right" | "left";
  width?: number;
  closeControl?: boolean;
  onClose: OnClose;
};

export default function SidePanel(props: PropsWithChildren<SidePanelProps>) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const checkClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!props.show) {
      return;
    }

    const wrongKeys = [
      event.buttons !== 1,
      event.altKey,
      event.ctrlKey,
      event.metaKey,
      event.shiftKey,
    ].filter(Boolean);
    if (wrongKeys.length) {
      return;
    }
    const clickInside = sidebarRef.current?.contains(event.target as Node);
    if (!clickInside) {
      props.onClose();
    }
  };

  const keyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (!props.show) {
      return;
    }
    const wrongKeys = [
      event.key !== "Escape",
      event.altKey,
      event.ctrlKey,
      event.metaKey,
      event.shiftKey,
    ].filter(Boolean);
    if (wrongKeys.length) {
      return;
    }
    event.preventDefault();
    props.onClose();
  };

  useEffect(() => {
    if (props.show) {
      sidebarRef.current?.focus();
    }
  }, [props.show]);

  const closeControl = () => (
    <div className="close-control" onClick={props.onClose}>
      &times;
    </div>
  );

  return (
    <div className="side-panel-outer">
      <div
        className={classNames("background", { show: props.show })}
        onMouseDown={checkClick}
      >
        <div
          ref={sidebarRef}
          className={classNames("side-panel-inner", props.position || "right", {
            close: props.closeControl !== false,
          })}
          style={{ width: `${props.width || 600}px` }}
          tabIndex={-1}
          onKeyDown={keyDown}
        >
          {props.closeControl !== false && closeControl()}
          {props.children}
        </div>
      </div>
    </div>
  );
}
