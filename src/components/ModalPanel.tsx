import { PropsWithChildren, useRef, useEffect } from "react";
import classNames from "classnames";
import "@/components/ModalPanel.scss";

type OnClose = () => void;

type ModalPanelProps = {
  show: boolean;
  width?: number;
  clickClose?: boolean;
  closeControl?: boolean;
  onClose: OnClose;
};

export default function ModalPanel(props: PropsWithChildren<ModalPanelProps>) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const checkClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!props.show) {
      return;
    }

    if (props.clickClose === false) {
      return
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
    <div className="modal-panel">
      <div
        className={classNames("background", { show: props.show })}
        onMouseDown={checkClick}
      >
        <div
          ref={sidebarRef}
          className={classNames("modal-panel", {
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
