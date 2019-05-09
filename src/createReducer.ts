type SimpleAction<ActionType extends string> = {
  type: ActionType;
};
type Reducer<State, Action extends SimpleAction<string>> = (
  state: State,
  action: Action,
) => State;
type PureReducer<State, Action extends SimpleAction<string>> = (
  state: State,
  action: Action,
) => State;

export type Count = number;
const increment = 'increment';
type IncrementAction = SimpleAction<typeof increment>;

type ActionReducerMap<State, Action extends SimpleAction<string>> = {
  [ActionType in Action['type']]: PureReducer<State, SimpleAction<ActionType>>
};

const countActionReducerMap: ActionReducerMap<Count, IncrementAction> = {
  [increment]: (count, { type }: IncrementAction) => count + 1,
};

type CreateReducer = <State>(
  initialState: State,
) => <ARM extends ActionReducerMap<State, SimpleAction<string>>>(
  arm: {
    [ActionType in keyof ARM]: PureReducer<
      State,
      SimpleAction<ActionType extends string ? ActionType : string>
    >
  },
) => PureReducer<State, SimpleAction<keyof ARM>>;
const createReducer: CreateReducer = initialState => arm => (
  state = initialState,
  action,
) => {
  const actionTypes = Object.keys(arm);

  if (actionTypes.includes(action.type as string)) {
    return arm[action.type](state, action);
  } else {
    return state;
  }
};

const countReducer = createReducer(0)(countActionReducerMap);

const countReducerInline = createReducer(0)({
  [increment]: (count, { type }: IncrementAction) => count + 1,
});
