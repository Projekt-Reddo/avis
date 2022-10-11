import { hideLeftNav, showLeftNav } from "store/slices/leftNavSlice";
import { LEFT_NAV_MIN_SWIPE_DISTANCE } from "utils/constants";
import { useAppDispatch } from "utils/react-redux-hooks";
import { useHorizontalSwipe } from "utils/useSwipe";

export const useLeftNav = ({
    minSwipeDistance = LEFT_NAV_MIN_SWIPE_DISTANCE,
} = {}) => {
    const dispatch = useAppDispatch();

    const swipe = useHorizontalSwipe({
        minSwipeDistance,
        handleRightSwipe: () => dispatch(showLeftNav()),
        handleLeftSwipe: () => dispatch(hideLeftNav()),
    });

    return swipe;
};
