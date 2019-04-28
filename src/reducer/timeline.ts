import { last, uniqueId } from 'lodash';
import { DateTime, Duration, Zone } from 'luxon';
import update from 'immutability-helper';

export const initialState = {
  timelines: []
};

export type TimeItem = {
  id: string;
  delta: Duration;
  timezone: Zone;
  comment: string | null;
};

export type Timeline = {
  id: string;
  name: string;
  start: DateTime;
  items: Array<TimeItem>;
};

type State = {
  timelines: Array<Timeline>;
};

type AddTimelineAction = {
  type: 'ADD_TIMELINE';
};

type UpdateimelineAction = {
  type: 'UPDATE_TIMELINE';
  payload: {
    oldTimeline: Timeline;
    timeline: Timeline;
  };
};

type AddTimeItemAction = {
  type: 'ADD_TIME_ITEM';
  payload: {
    timeline: Timeline;
  };
};

type UpdateTimeItemAction = {
  type: 'UPDATE_TIME_ITEM';
  payload: {
    timeline: Timeline;
    oldItem: TimeItem;
    item: TimeItem;
  };
};

export type Action =
  | AddTimelineAction
  | UpdateimelineAction
  | AddTimeItemAction
  | UpdateTimeItemAction;

function updateTimeline(
  timelines: Array<Timeline>,
  oldTimeline: Timeline,
  timeline: Timeline
): Array<Timeline> {
  const oldTimelineIndex = timelines.findIndex(t => t === oldTimeline);
  const newTimeline = {
    ...oldTimeline,
    ...timeline
  };

  return update(timelines, { $splice: [[oldTimelineIndex, 1, newTimeline]] });
}

function updateTimeItem(timeline: Timeline, oldItem: TimeItem, item: TimeItem) {
  const oldItemIndex = timeline.items.findIndex(i => i === oldItem);

  return {
    ...timeline,
    items: update(timeline.items, {
      $splice: [
        [
          oldItemIndex,
          1,
          {
            ...oldItem,
            ...item
          }
        ]
      ]
    })
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TIMELINE':
      return {
        ...state,
        timelines: [
          ...state.timelines,
          {
            id: uniqueId('timeline_'),
            name: 'Timeline Untitled',
            start: DateTime.local(),
            items: []
          }
        ]
      };

    case 'UPDATE_TIMELINE':
      return {
        ...state,
        timelines: updateTimeline(
          state.timelines,
          action.payload.oldTimeline,
          action.payload.timeline
        )
      };

    case 'ADD_TIME_ITEM':
      return (() => {
        const { timeline } = action.payload;
        const lastItem = last(timeline.items);

        return {
          ...state,
          timelines: updateTimeline(state.timelines, timeline, {
            ...timeline,
            items: [
              ...timeline.items,
              {
                delta: Duration.fromObject({ hour: 0 }),
                timezone: lastItem ? lastItem.timezone : timeline.start.zone,
                comment: '',
                id: uniqueId(`${timeline.id}_item_`)
              }
            ]
          })
        };
      })();

    case 'UPDATE_TIME_ITEM':
      return (() => {
        const { timeline, oldItem, item } = action.payload;
        const timelineIndex = state.timelines.findIndex(t => t === timeline);

        return {
          ...state,
          timelines: updateTimeline(
            state.timelines,
            timeline,
            updateTimeItem(timeline, oldItem, item)
          )
        };
      })();

    default:
      return state;
  }
}
