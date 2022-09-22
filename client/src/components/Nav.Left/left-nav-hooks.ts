import { hideLeftNav, showLeftNav } from "store/slices/leftNavSlice";
import { useAppDispatch } from "utils/react-redux-hooks";
import { useHorizontalSwipe } from "utils/useSwipe";

export const useLeftNav = ({ minSwipeDistance = 50 } = {}) => {
    const dispatch = useAppDispatch();

    const swipe = useHorizontalSwipe({
        minSwipeDistance,
        handleRightSwipe: () => dispatch(showLeftNav()),
        handleLeftSwipe: () => dispatch(hideLeftNav()),
    });

    return swipe;
};
