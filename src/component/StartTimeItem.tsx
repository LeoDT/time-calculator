import React, { Dispatch, useState, useRef } from 'react';
import { DateTime } from 'luxon';

import { Timeline, Action } from '../reducer/timeline';
import TimeZoneSelect from './TimeZoneSelect';

type Props = {
  timeline: Timeline;
  dispatch: Dispatch<Action>;
};

export default function StartTimeItem({ timeline, dispatch }: Props) {
  const [editStart, setEditStart] = useState(false);
  const { start } = timeline;
  const inputRef = useRef<HTMLInputElement>();

  return (
    <div className="start-time-item card">
      <div className="section">
        <div className="row" style={{ alignItems: 'center' }}>
          <div>Start</div>
          <div style={{ marginLeft: 'auto', flexShrink: 1 }}>
            <TimeZoneSelect
              value={timeline.start.zone}
              onChange={zone =>
                dispatch({
                  type: 'UPDATE_TIMELINE',
                  payload: {
                    oldTimeline: timeline,
                    timeline: {
                      ...timeline,
                      start: DateTime.fromObject({
                        ...start.toObject(),
                        zone
                      })
                    }
                  }
                })
              }
            />
          </div>
        </div>
        <h4>
          {editStart ? (
            <span>
              <input
                type="datetime-local"
                ref={inputRef}
                defaultValue={start.toFormat("yyyy-MM-dd'T'HH:mm")}
                autoFocus
              />
              <button
                className="small primary"
                style={{ marginLeft: 0 }}
                onClick={() => {
                  if (inputRef.current && inputRef.current.value) {
                    const dt = DateTime.fromISO(inputRef.current.value, {
                      locale: DateTime.local().locale,
                      zone: start.zone
                    });

                    if (dt.isValid) {
                      dispatch({
                        type: 'UPDATE_TIMELINE',
                        payload: {
                          oldTimeline: timeline,
                          timeline: {
                            ...timeline,
                            start: dt
                          }
                        }
                      });
                      setEditStart(false);
                    }
                  }
                }}
              >
                OK
              </button>
              <button className="small" onClick={() => setEditStart(false)}>
                Cancel
              </button>
            </span>
          ) : (
            <span onClick={() => setEditStart(true)}>
              {start.toLocaleString(DateTime.DATETIME_SHORT)}
              <span className="icon-edit" />
            </span>
          )}
        </h4>
      </div>
      <div className="section button-section">
        <div className="section-button disabled">Before</div>
        <div className="section-button disabled">Delete</div>
        <div
          className="section-button"
          onClick={() => {
            dispatch({ type: 'ADD_TIME_ITEM', payload: { timeline, at: 0 } });
          }}
        >
          After
        </div>
      </div>
    </div>
  );
}
