import React, { useState, useEffect } from "react";

const ShowTimeDifference = ({ completeTime, setCardStyle }: any) => {
  const [time, setTime] = useState<Date | null>(
    new Date(completeTime?.end.getTime() - new Date().getTime())
  );

  const newStartTime = React.useMemo(
    () =>
      completeTime?.start instanceof Date ? completeTime?.start : new Date(),
    [completeTime?.start]
  );
  useEffect(() => {
    const getCardStyle = () => {
      if (!completeTime?.end) return;
      if (!newStartTime) return;
      const totalDifference =
        completeTime?.end?.getTime() - newStartTime?.getTime();
      if (new Date().getTime() > completeTime?.end?.getTime()) {
        setCardStyle("");
        return;
      }
      const seventyFivePercentThreshold = 0.5 * totalDifference;
      const ninetyPercentThreshold = 0.75 * totalDifference;
      const currentTime = new Date();
      const currentDifference = currentTime.getTime() - newStartTime?.getTime();
      if (currentDifference >= ninetyPercentThreshold) {
        setCardStyle(
          "!border-red-500/40 dark:border-red-500/10 hover:!border-red-700 shadow-lg shadow-red-400/15 !bg-red-300/20 !dark:bg-red-300/10"
        );
        return;
      } else if (currentDifference >= seventyFivePercentThreshold) {
        setCardStyle(
          "!border-yellow-500/40 dark:border-yellow-500/10 hover:!border-yellow-700 shadow-lg shadow-yellow-400/15 !bg-yellow-300/20 !dark:bg-yellow-300/10"
        );
      } else {
        setCardStyle("");
      }
    };

    const interval = setInterval(() => {
      if (!completeTime?.end) return;
      const currentTime = new Date();
      const diffMilliseconds =
        completeTime?.end.getTime() - currentTime.getTime();

      if (completeTime?.isCompleted || diffMilliseconds < 0) {
        clearInterval(interval);
        setTime(null);
        getCardStyle();
      } else {
        getCardStyle();
        setTime(new Date(diffMilliseconds));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [completeTime, newStartTime, setCardStyle]);

  const calculateRemainingTime = () => {
    if (completeTime?.isCompleted) return "Completed";
    if (!time) return "Time over";
    const padZero = (value: number) => (value < 10 ? `0${value}` : value);
    const seconds = Math.floor((time.getTime() / 1000) % 60);
    const minutes = Math.floor((time.getTime() / 1000 / 60) % 60);
    const hours =
      Math.floor((time.getTime() / (1000 * 60 * 60)) % 24) % 24 || null;
    const days = Math.floor(time.getTime() / (1000 * 60 * 60 * 24));

    const formattedDays = days > 0 ? `${days}d ` : "";
    const formattedHours = hours ? `${padZero(hours)}h ` : ""; // Convert 0 to 12
    const formattedMinutes = minutes > 0 ? `${padZero(minutes)}m ` : "";
    const formattedSeconds = !formattedMinutes ? `${padZero(seconds)}s` : "";
    const formattedTime =
      formattedDays + formattedHours + formattedMinutes + formattedSeconds;
    return `${formattedTime} left`;
  };

  const getTimeTextStyle = () => {
    if (!completeTime?.end) return;
    if (!newStartTime) return;
    const totalDifference =
      completeTime?.end?.getTime() - newStartTime?.getTime();
    const seventyFivePercentThreshold = 0.5 * totalDifference;
    const ninetyPercentThreshold = 0.75 * totalDifference;
    const currentTime = new Date();
    const currentDifference = currentTime.getTime() - newStartTime?.getTime();
    if (currentDifference >= ninetyPercentThreshold) {
      return "text-red-500";
    } else if (currentDifference >= seventyFivePercentThreshold) {
      return "text-yellow-500";
    } else if (completeTime?.isCompleted) {
      return "text-green-400";
    } else {
      return "text-neutral-500";
    }
  };
  return (
    <div className={`text-xs  ${getTimeTextStyle()}`}>
      {calculateRemainingTime()}
    </div>
  );
};

export default ShowTimeDifference;
