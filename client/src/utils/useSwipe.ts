import React, { useState } from "react";

export const useHorizontalSwipe = ({
    minSwipeDistance = 50,
    handleLeftSwipe = () => {},
    handleRightSwipe = () => {},
} = {}) => {
    // minSwipeDistance = the required distance between touchStart and touchEnd to be detected as a swipe

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (
        e: React.TouchEvent<HTMLDivElement>
    ) => {
        setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (
        e: React.TouchEvent<HTMLDivElement>
    ) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (
        _: React.TouchEvent<HTMLDivElement>
    ) => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            // console.log("swipe", isLeftSwipe ? "left" : "right");
        }

        // add your conditional logic here
        if (isLeftSwipe) {
            handleLeftSwipe();
        }

        if (isRightSwipe) {
            handleRightSwipe();
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
};
