import Icon from "components/shared/Icon";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { HISTORY } from "utils/constants";
import storage from "utils/useStorage";

interface HistoryProps {
    onClickElement: any;
    setShowHistory: React.Dispatch<React.SetStateAction<boolean>>;
    inputRef: React.RefObject<HTMLInputElement>;
}

const History: FunctionComponent<HistoryProps> = ({
    onClickElement,
    setShowHistory,
    inputRef,
}) => {
    const [history, setHistory] = useState<Array<string>>([]);
    const historyRef = useRef<HTMLDivElement>(null);

    const closeOpenHistory = (e: any) => {
        if (
            historyRef &&
            !historyRef.current?.contains(e.target) &&
            !inputRef.current?.contains(e.target)
        ) {
            // Disable history except input value and options select
            setShowHistory(false);
        }
    };

    useEffect(() => {
        async function getHistory() {
            const value: Set<string> = await storage.get(HISTORY);
            if (value) setHistory(Array.from(value).reverse()); // convert from Set to Array
        }
        getHistory();

        document.addEventListener("click", closeOpenHistory);
        return () => {
            document.removeEventListener("click", closeOpenHistory);
        };
    }, []);

    if (!history || history.length == 0) {
        return <></>;
    }

    return (
        <div
            className="absolute top-12 w-full h-fit py-3 bg-[color:var(--body-bg-color)] rounded-xl border-[0.25px] border-[color:var(--border-color)] shadow-lg"
            ref={historyRef}
            data-cy="text-search-search-history"
        >
            {history.map((search) => (
                <div
                    key={search}
                    className="w-full py-2 px-3 cursor-pointer hover:bg-[color:var(--element-bg-color-elevate-1)]"
                    onClick={() => {
                        onClickElement(search);
                    }}
                    data-cy="text-search-search-history-item"
                >
                    <Icon
                        icon="clock-rotate-left"
                        size="lg"
                        className="text-[#4964B8]"
                    />
                    <span className="ml-3 text-[#4964B8]">{search}</span>
                </div>
            ))}
        </div>
    );
};

export default History;
