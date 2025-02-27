import { useCallback } from 'react';
import { useDrop } from 'react-dnd';
import update from 'immutability-helper';
import DraggableWidget from '../../dnd/DraggableWidget';
import { WidgetTypes } from '../../dnd/WidgetTypes';
import pageStyles from './Page.module.css';

// eslint has been disabled here as the unused args date and leftPage might be used in future.
// eslint-disable-next-line no-unused-vars
const Page = ({ date, widgets, setWidgets }) => {
  const moveWidget = useCallback(
    (id, left, top) => {
      // Widgets are page specific and cannot be moved from one page to another
      if (widgets[id]) {
        setWidgets(
          update(widgets, {
            [id]: {
              $merge: { left, top },
            },
          })
        );
      }
    },
    [widgets]
  );

  const [, drop] = useDrop(
    () => ({
      accept: [
        WidgetTypes.TODO_LIST,
        WidgetTypes.CALENDAR,
        WidgetTypes.HABIT_TRACKER,
        WidgetTypes.TEXT,
      ],
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();

        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);

        moveWidget(item.id, left, top);
        return undefined;
      },
    }),
    [moveWidget]
  );

  return (
    <div className={pageStyles.Page} ref={drop}>
      {Object.keys(widgets).map((key) => (
        <DraggableWidget id={key} {...widgets[key]} />
      ))}
      <textarea />
    </div>
  );
};

export default Page;
