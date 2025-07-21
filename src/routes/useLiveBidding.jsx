// useLiveBidding.js (or .ts if using TypeScript)
import { useEffect, useState, useRef } from "react";

export const useLiveBidding = (itemId) => {
  const [currentBid, setCurrentBid] = useState(null);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/bid/${itemId}`);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);
      } else {
        setCurrentBid(data.bid);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => ws.close();
  }, [itemId]);

  const placeBid = (amount, bidder) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected.");
      return;
    }
    socketRef.current.send(JSON.stringify({ bid: amount, bidder }));
  };

  return { currentBid, placeBid, error };
};
