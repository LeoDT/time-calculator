import React, { useReducer } from 'react';
import { DateTime } from 'luxon';

import { initialState, reducer } from '../reducer/timeline';

import EditableText from './EditableText';
import StartTimeItem from './StartTimeItem';
import TimeItem from './TimeItem';

export default function Timelines() {
  const [{ timelines }, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="timelines">
      {timelines.map((timeline, timelineIndex) => (
        <div className="timeline" key={timeline.id}>
          <h3>
            <EditableText
              value={timeline.name}
              onChange={value =>
                dispatch({
                  type: 'UPDATE_TIMELINE',
                  payload: {
                    oldTimeline: timeline,
                    timeline: {
                      ...timeline,
                      name: value
                    }
                  }
                })
              }
            />
          </h3>
          <div className="time-items row">
            <StartTimeItem timeline={timeline} dispatch={dispatch} />
            {timeline.items.map(item => (
              <TimeItem timeline={timeline} item={item} key={item.id} dispatch={dispatch} />
            ))}
            <div
              className="add-time card clickable"
              onClick={() =>
                dispatch({
                  type: 'ADD_TIME_ITEM',
                  payload: {
                    timeline
                  }
                })
              }
            >
              <div className="section">
                <h4>Add Time</h4>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="primary" onClick={() => dispatch({ type: 'ADD_TIMELINE' })}>
        Add Timeline
      </button>
    </div>
  );
}
