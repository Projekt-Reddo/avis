type ActionType = {
    type: string;
    payload?: any;
};

type DispatchType = (args: ActionType) => ActionType;

interface InitialStateForApi {
    status: "idle" | "loading" | "error";
    data: any;
}
