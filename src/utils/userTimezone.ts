/* eslint-disable */ 
export const getUserTimezone = () => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    return timeZone;
  };
  