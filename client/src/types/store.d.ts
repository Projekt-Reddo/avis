type ActionType = {
    type: string;
    payload?: any;
};

type DispatchType = (args: ActionType) => ActionType;

interface AsyncReducerInitialState {
    status: "idle" | "loading" | "error";
    data: any;
    error: any;
    tableData?: any;
}

interface RootState {
    [key: string]: AsyncReducerInitialState;
    toast: ToastType[];
    leftNavShowing: boolean;
}
