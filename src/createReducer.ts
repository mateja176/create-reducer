type SimpleAction<ActionType extends string> = {
  type: ActionType;
};
interface PayloadAction<Payload, ActionType extends string>
  extends SimpleAction<ActionType> {
  payload: Payload;
}
type Reducer<
  State,
  Action extends SimpleAction<string> | PayloadAction<any, string>
> = (state: State, action: Action) => State;
type PureReducer<
  State,
  Action extends SimpleAction<string> | PayloadAction<any, string>
> = (state: State, action: Action) => State;

export type Count = number;
const increment = 'increment';
type IncrementAction = SimpleAction<typeof increment>;
const decrementBy = 'decrementBy';
type DecrementByAction = PayloadAction<Count, typeof decrementBy>;
type CountAction = IncrementAction | DecrementByAction;
type CountActionType = CountAction['type'];

type ActionReducerMap<State, Action extends SimpleAction<string>> = {
  // cannot be a generic function because then the implementation would also have to be a generic function
  // cannot be a ternary expression because then there would have to be a parameter representing the reducer
  // even if there was a type parameter representing the reducer it would be a flattened version representing all reducers
  [ActionType in Action['type']]: PureReducer<
    State,
    SimpleAction<ActionType> & PayloadAction<any, ActionType>
  >
};

const countActionReducerMap: ActionReducerMap<
  Count,
  IncrementAction | DecrementByAction
> = {
  [increment]: (count, { type }: IncrementAction) => count + 1,
  [decrementBy]: (count, { type, payload: amount }: DecrementByAction) =>
    count - amount,
};

type CreateReducer = <State>(
  initialState: State,
) => <ActionTypes extends string>(
  arm: {
    [ActionType in ActionTypes]: PureReducer<
      State,
      SimpleAction<ActionType> & PayloadAction<any, ActionType>
    >
  },
) => Reducer<
  State,
  SimpleAction<ActionTypes> & PayloadAction<any, ActionTypes>
>;
const createReducer: CreateReducer = initialState => arm => (
  state = initialState,
  action,
) => {
  const actionTypes = Object.keys(arm);

  if (actionTypes.includes(action.type)) {
    return arm[action.type](state, action);
  } else {
    return state;
  }
};

const countReducer = createReducer(0)(countActionReducerMap);

const countReducerInline = createReducer(0)({
  [increment]: (count, { type }: IncrementAction) => count + 1,
  [decrementBy]: (count, { type, payload: amount }: DecrementByAction) =>
    count - amount,
});
