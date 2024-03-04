import React, { useState, useEffect } from "react";

const ShowTimeDifference = ({ timeBound, timestamp, setCardStyle }: any) => {
  const [time, setTime] = useState<Date | null>(new Date(timeBound.getTime() - new Date().getTime()));

  useEffect(() => {
    
  const getCardStyle = () => {
    if (!timeBound) return;
    if (!timestamp) return;
    const totalDifference = timeBound.getTime() - timestamp.getTime();
    if(new Date().getTime() > timeBound.getTime()) {
      setCardStyle("");
      return;
    }
    const seventyFivePercentThreshold = 0.5 * totalDifference;
    const ninetyPercentThreshold = 0.75 * totalDifference;
    const currentTime = new Date();
    const currentDifference = currentTime.getTime() - timestamp.getTime();
    if (currentDifference >= ninetyPercentThreshold) {
      setCardStyle("!border-red-500/40 dark:border-red-500/10 hover:!border-red-700 shadow-lg shadow-red-400/15 !bg-red-300/20 !dark:bg-red-300/10")
      return 
    } else if (currentDifference >= seventyFivePercentThreshold) {
      setCardStyle("!border-yellow-500/40 dark:border-yellow-500/10 hover:!border-yellow-700 shadow-lg shadow-yellow-400/15 !bg-yellow-300/20 !dark:bg-yellow-300/10")
    } else {
      setCardStyle("")
    }
  };
    const interval = setInterval(() => {
      
      if (!timeBound) return;
      const currentTime = new Date();
      const diffMilliseconds = timeBound.getTime() - currentTime.getTime();

      if (diffMilliseconds < 0) {
        clearInterval(interval);
        setTime(null);
        getCardStyle();
      } else {
        getCardStyle();
        setTime(new Date(diffMilliseconds));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeBound, timestamp, setCardStyle]);

  const calculateRemainingTime = () => {
    if (!time) return "Time over";
    const padZero = (value: number) => (value < 10 ? `0${value}` : value);
    const seconds = Math.floor((time.getTime() / 1000) % 60);
    const minutes = Math.floor((time.getTime() / 1000 / 60) % 60);
    const hours = (Math.floor((time.getTime() / (1000 * 60 * 60)) % 24)) % 12 || null;
    const days = Math.floor(time.getTime() / (1000 * 60 * 60 * 24));

    const formattedDays = (days > 0 ? `${days}d ` : "")
    const formattedHours = (hours ? `${padZero(hours)}h ` : "") // Convert 0 to 12
    const formattedMinutes = (minutes > 0 ? `${padZero(minutes)}m ` : "")
    const formattedSeconds = (!formattedMinutes ? `${padZero(seconds)}s` : "")
    const formattedTime = formattedDays + formattedHours + formattedMinutes + formattedSeconds;
    return `${formattedTime} left`;
  };
  
  const getTimeTextStyle = () => {
    if (!timeBound) return;
    if (!timestamp) return;
    const totalDifference = timeBound.getTime() - timestamp.getTime();
    const seventyFivePercentThreshold = 0.5 * totalDifference;
    const ninetyPercentThreshold = 0.75 * totalDifference;
    const currentTime = new Date();
    const currentDifference = currentTime.getTime() - timestamp.getTime();
    if (currentDifference >= ninetyPercentThreshold) {
      return "text-red-500";
    } else if (currentDifference >= seventyFivePercentThreshold) {
      return "text-yellow-500";
    } else {
      return "text-neutral-500";
    }
  };
  return (
    <div className={`text-xs  ${getTimeTextStyle()}`}>{calculateRemainingTime()}</div>
  );
};

export default ShowTimeDifference;