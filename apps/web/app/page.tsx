"use client";

import classes from "./page.module.css";
import { useSocket } from "../context/SocketProvider";
import { useState } from "react";

export default function page() {
  const { sendMessage, messages } = useSocket();

  const [message, setMessage] = useState<string>("");
  return (
    <div>
      <div>
        <input
          className={classes["chat-input"]}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="message..."
        />
        <button
          onClick={(e) => sendMessage(message)}
          className={classes["button"]}
        >
          Send
        </button>
      </div>
      <div>
        {messages.map((e) => (
          <li>{e}</li>
        ))}
      </div>
    </div>
  );
}
