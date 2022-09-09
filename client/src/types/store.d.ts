type ActionType = {
    type: string;
    payload?: any;
};

type DispatchType = (args: ActionType) => ActionType;

interface AsyncReducerInitialState {
    status: "idle" | "loading" | "error";
    data: any;
    error: any;
}

interface RootState {
    [key: string]: AsyncReducerInitialState;
}
