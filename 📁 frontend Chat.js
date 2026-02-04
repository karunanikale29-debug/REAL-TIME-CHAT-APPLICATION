import { useEffect, useRef, useState } from "react";

const socket = new WebSocket("ws://localhost:8080");

function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "history") {
        setMessages(data.messages);
      }

      if (data.type === "message") {
        setMessages((prev) => [...prev, data.message]);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (text.trim() === "") return;

    const message = {
      text,
      time: new Date().toLocaleTimeString(),
    };

    socket.send(JSON.stringify(message));
    setText("");
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div className="message" key={index}>
            <span>{msg.text}</span>
            <small>{msg.time}</small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
