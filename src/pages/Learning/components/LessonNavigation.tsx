import classNames from "classnames";

type OnNavigate = (position: number) => void;

type LessonNavigationProps = {
  count: number;
  position: number;
  onNavigate: OnNavigate;
};

export default function LessonNavigation(props: LessonNavigationProps) {
  if (props.count < 2) {
    return null;
  }

  const setPosition = (position: number) => {
    if (position >= 0 && position < props.count) {
      props.onNavigate(position);
    }
  };

  const nextEnabled = props.position < props.count - 1;
  const prevEnabled = props.position > 0;

  const nextActivity = () => {
    setPosition(props.position + 1);
  };
  const prevActivity = () => {
    setPosition(props.position - 1);
  };
  const gotoPosition = (position: number) => {
    setPosition(position);
  };

  return (
    <ul className="pagination">
      <li
        className={classNames("page-item", { disabled: !prevEnabled })}
        onClick={prevActivity}
      >
        <span className="page-link">&laquo;</span>
      </li>
      {Array(props.count > 2 ? props.count : 0)
        .fill(0)
        .map((_e, index) => (
          <li
            key={index}
            className={classNames("page-item", {
              active: index === props.position,
            })}
            onClick={() => gotoPosition(index)}
          >
            <span className="page-link">{index + 1}</span>
          </li>
        ))}
      <li
        className={classNames("page-item", { disabled: !nextEnabled })}
        onClick={nextActivity}
      >
        <span className="page-link">&raquo;</span>
      </li>
    </ul>
  );
}
