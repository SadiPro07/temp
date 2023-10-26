/* eslint-disable */ 
import axios from "axios";
import { useAuth } from "../context/AuthContext"
import { MEETINGS_ENDPOINT} from "../utils/endpoint"
import { useEffect, useState } from 'react';
import { getUserTimezone } from "./userTimezone";

export const useMeetings = () => {
  const { accessToken,  refreshAccessToken} = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = async () => {
    try {
      const timezone = getUserTimezone();
      const response = await axios.get(`${MEETINGS_ENDPOINT}?user_tz=${timezone}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

        setMeetings(response.data?.meetings);
        console.log("meetings", meetings)
      setError(null);
    } catch (error) {
    if (
        error.response &&
        error?.response?.data?.messages[0]?.token_type === "access"
      ) {
        console.log("Access token expired. Refreshing...", error);
         refreshAccessToken();
        console.log("Retrying the request...");
        // Retry the original request or any other operation that requires a valid access token
      } else {
        console.log("error", error);
        setError("Error fetching meetings"); // Set success state to false
      }
    }
    finally {
      setLoading(false);
    }
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchMeetings();

    // Fetch meetings every 5 seconds
    const intervalId = setInterval(() => {
      fetchMeetings();
    }, 5000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [accessToken, refreshAccessToken]);

  return { meetings, loading, error };
};
