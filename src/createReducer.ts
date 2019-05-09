type SimpleAction<ActionType> = {
  type: ActionType;
};
interface PayloadAction<Payload, ActionType> extends SimpleAction<ActionType> {
  payload: Payload;
}
type Reducer<
  State,
  Action extends
    | SimpleAction<Action['type']>
    | PayloadAction<any, Action['type']>
> = (state: State, action: Action) => State;
type PureReducer<
  State,
  Action extends
    | SimpleAction<Action['type']>
    | PayloadAction<any, Action['type']>
> = (state: State, action: Action) => State;

export type Count = number;
const increment = 'increment';
type IncrementAction = SimpleAction<typeof increment>;
const decrementBy = 'decrementBy';
type DecrementByAction = PayloadAction<Count, typeof decrementBy>;

type ActionReducerMap<
  State,
  Action extends SimpleAction<string> | PayloadAction<any, string>
> = {
  [ActionType in Action['type']]: <A extends SimpleAction<ActionType>>(
    state: State,
    action: A,
  ) => State
};

const countActionReducerMap: ActionReducerMap<
  Count,
  IncrementAction | DecrementByAction
> = {
  [increment]: (count, { type }: IncrementAction) => count + 1,
  [decrementBy]: (count, { payload: amount }: DecrementByAction) =>
    count - amount,
};

// type CreateReducer = <State>(
//   initialState: State,
// ) => <ARM>(
//   arm: {
//     [ActionType in keyof ARM]: PureReducer<State, SimpleAction<ActionType>>
//   },
// ) => Reducer<State, SimpleAction<keyof ARM>>;
// const createReducer: CreateReducer = initialState => arm => (
//   state = initialState,
//   action,
// ) => {
//   const actionTypes = Object.keys(arm);

//   if (actionTypes.includes(action.type as string)) {
//     return arm[action.type](state, action);
//   } else {
//     return state;
//   }
// };

// const countReducer = createReducer(0)(countActionReducerMap);

// const countReducerInline = createReducer(0)({
//   [increment]: (count, { type }: IncrementAction) => count + 1,
// });
