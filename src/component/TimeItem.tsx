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

                dispatch({
                  type: 'UPDATE_TIME_ITEM',
                  payload: {
                    timeline,
                    oldItem: item,
                    item: { ...item, delta: Duration.fromObject({ hours }) }
                  }
                });
              }}
              maxLength={3}
            />
          </div>
          <div style={{ marginLeft: 'auto', flexShrink: 1 }}>
            <TimeZoneSelect
              value={time.zone}
              onChange={z => {
                dispatch({
                  type: 'UPDATE_TIME_ITEM',
                  payload: {
                    timeline,
                    oldItem: item,
                    item: { ...item, timezone: z }
                  }
                });
              }}
            />
          </div>
        </div>

        <h4>{time.toLocaleString(DateTime.DATETIME_SHORT)}</h4>
      </div>
    </div>
  );
}
