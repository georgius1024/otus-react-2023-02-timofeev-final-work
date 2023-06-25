import { PropsWithChildren, useRef } from "react";
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
    console.log(event);
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
    console.log(sidebarRef.current);
    const clickInside = sidebarRef.current?.contains(event.target as Node);
    const visible = props.show;

    if (!clickInside && visible) {
      props.onClose();
    }
  };

  const closeControl = () => (
    <div className="close-control" onClick={props.onClose}>
      &times;
    </div>
  );

  return (
    <div className="side-panel">
      <div
        className={classNames("background", { show: props.show })}
        onMouseDown={checkClick}
      >
        <div
          ref={sidebarRef}
          className={classNames("side-panel", props.position || "right")}
          style={{ width: `${props.width || 600}px` }}
        >
          {props.closeControl !== false && closeControl()}
          {props.children}
        </div>
      </div>
    </div>
  );
}
