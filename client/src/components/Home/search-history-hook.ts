import { HISTORY } from "utils/constants";
import storage from "utils/useStorage";

const historyLimit = 5;

export const saveSearchHistory = async (search: string) => {
    var values: Set<string> = await storage.get(HISTORY);
    if (!values) {
        values = new Set<string>();
    }

    if (values.has(search)) {
        values.delete(search);
    }

    if (values.size >= historyLimit) {
        const oldestValue = Array.from(values)[0] ?? "";
        values.delete(oldestValue);
    }

    values.add(search);
    await storage.set(HISTORY, values);
};
