import { useState, useEffect } from "react";
import mockData from "../data/mockState.json";

const POLL_INTERVAL = 5000;
const API_URL = "http://localhost:8000/state";

export function useNexusState() {
  const [state, setState] = useState(mockData);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Bad response");
        const data = await res.json();
        setState(data);
      } catch {
        setState(mockData);
      }
    };

    fetchState();
    const interval = setInterval(fetchState, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return state;
}