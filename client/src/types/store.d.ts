type ActionType = {
    type: string;
    payload?: any;
};

type DispatchType = (args: ActionType) => ActionType;

type StateStatus = "init" | "idle" | "loading" | "error";

interface AsyncReducerInitialState {
    status: StateStatus;
    data: any;
    error: any;
    tableData?: any;
}

interface RootState {
    [key: string]: AsyncReducerInitialState;
    toast: ToastType[];
    leftNavShowing: boolean;
}
