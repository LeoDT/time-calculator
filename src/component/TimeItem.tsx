import { findIndex, reduce } from 'lodash';
import React, { useMemo, Dispatch } from 'react';
import { DateTime, Duration } from 'luxon';

import { TimeItem as TimeItemType, Timeline, Action } from '../reducer/timeline';

import TimeZoneSelect from './TimeZoneSelect';
import EditableText from './EditableText';

type Props = {
  timeline: Timeline;
  item: TimeItemType;
  dispatch: Dispatch<Action>;
};

export default function TimeItem({ timeline, item, dispatch }: Props) {
  const prevs = useMemo(() => {
    const index = findIndex(timeline.items, item);

    if (index === -1) return [];

    return timeline.items.slice(0, index);
  }, [timeline, item]);

  const time = useMemo(() => {
    const t = reduce([...prevs, item], (s, c) => s.plus(c.delta), timeline.start);

    t.plus(item.delta);

    return t.setZone(item.timezone);
  }, [timeline, prevs]);

  function updateItem(newItem: TimeItemType) {
    dispatch({
      type: 'UPDATE_TIME_ITEM',
      payload: {
        timeline,
        oldItem: item,
        item: newItem
      }
    });
  }

  const itemIndex = timeline.items.findIndex(i => i === item);

  return (
    <div className="time-item card">
      <div className="section">
        <div className="row" style={{ alignItems: 'center' }}>
          <div className="delta">
            +
            <EditableText
              value={item.delta.as('hours').toString()}
              onChange={v => {
                const hours = parseInt(v, 10);

                if (Number.isNaN(hours)) return;

                updateItem({ ...item, delta: Duration.fromObject({ hours }) });
              }}
              maxLength={3}
            />
          </div>
          <div style={{ marginLeft: 'auto', flexShrink: 1 }}>
            <TimeZoneSelect
              value={time.zone}
              onChange={z => {
                updateItem({ ...item, timezone: z });
              }}
            />
          </div>
        </div>

        <h4>{time.toLocaleString(DateTime.DATETIME_SHORT)}</h4>

        <div className="comment">
          <EditableText
            value={item.comment}
            placeholder="Comment..."
            onChange={comment => {
              updateItem({ ...item, comment });
            }}
          />
        </div>
      </div>
      <div className="section button-section">
        <div
          className="section-button"
          onClick={() => {
            dispatch({ type: 'ADD_TIME_ITEM', payload: { timeline, at: itemIndex } });
          }}
        >
          Before
        </div>
        <div
          className="section-button"
          onClick={() => {
            dispatch({ type: 'REMOVE_TIME_ITEM', payload: { timeline, item } });
          }}
        >
          Delete
        </div>
        <div
          className="section-button"
          onClick={() => {
            dispatch({ type: 'ADD_TIME_ITEM', payload: { timeline, at: itemIndex + 1 } });
          }}
        >
          After
        </div>
      </div>
    </div>
  );
}
