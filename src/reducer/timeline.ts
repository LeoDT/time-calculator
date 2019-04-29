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
    at?: number;
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

type RemoveTimeItemAction = {
  type: 'REMOVE_TIME_ITEM';
  payload: {
    timeline: Timeline;
    item: TimeItem;
  };
};

export type Action =
  | AddTimelineAction
  | UpdateimelineAction
  | AddTimeItemAction
  | UpdateTimeItemAction
  | RemoveTimeItemAction;

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

function reducer(state: State, action: Action): State {
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
        const { timeline, at } = action.payload;
        const insertIndex = at || at === 0 ? at : timeline.items.length;
        const lastItem = timeline.items[insertIndex - 1];

        return {
          ...state,
          timelines: updateTimeline(state.timelines, timeline, {
            ...timeline,
            items: update(timeline.items, {
              $splice: [
                [
                  insertIndex,
                  0,
                  {
                    delta: Duration.fromObject({ hour: 0 }),
                    timezone: lastItem ? lastItem.timezone : timeline.start.zone,
                    comment: '',
                    id: uniqueId(`${timeline.id}_item_`)
                  }
                ]
              ]
            })
          })
        };
      })();

    case 'UPDATE_TIME_ITEM':
      return (() => {
        const { timeline, oldItem, item } = action.payload;

        return {
          ...state,
          timelines: updateTimeline(
            state.timelines,
            timeline,
            updateTimeItem(timeline, oldItem, item)
          )
        };
      })();

    case 'REMOVE_TIME_ITEM':
      return (() => {
        const { timeline, item } = action.payload;
        const itemIndex = timeline.items.findIndex(i => i === item);

        return {
          ...state,
          timelines: updateTimeline(state.timelines, timeline, {
            ...timeline,
            items: update(timeline.items, { $splice: [[itemIndex, 1]] })
          })
        };
      })();

    default:
      return state;
  }
}

function persist(state: State, action: Action) {
  const s = reducer(state, action);

  setTimeout(() => {
    localStorage.setItem('leodt/time-calculator', JSON.stringify(s));
  }, 0);

  return s;
}

export default persist;
