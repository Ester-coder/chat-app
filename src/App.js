import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import ProfileImage from "./components/ProfileImage";
import "./App.css";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   Notification.requestPermission();
  // }, []);

  useEffect(() => {
      if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      // if (Notification.permission === "granted") {
      //   new Notification(`${data.username} sent a message`, {
      //     body: data.message,
      //   });
      // }
    });

    return () => {
      socket.off("connect");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message) {
      socket.emit("sendMessage", { username, message });
      setMessage("");
    }
  };

  const handleSetUsername = () => {
    if (username) {
      setIsUsernameSet(true);
    }
  };

  const addEmoji = (emoji) => {
    console.log("here");
    setMessage(message + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-container">
      {!isUsernameSet ? (
        <div className="username-container">
          <h2 className="username-title">Set Your Username</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
            className="username-input"
          />
          <button onClick={handleSetUsername} className="set-username-button">
            Set Username
          </button>
        </div>
      ) : (
        <>
          <h1 className="chat-title">Chat App</h1>
          <div className="messages">
            <div className="message-container">
              {messages.map((msg, index) => (
                <div key={index} className={msg.username === username ? 'message-sent' : 'message-received'}>
                  <ProfileImage username={msg.username} />
                  <div className={msg.username === username ? 'message sent' : 'message received'}>
                    <span>{msg.message}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="input-container">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="message-input"
            />
            <button onClick={sendMessage} className="send-button">
              Send
            </button>
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="emoji-button"
            >
              😊
            </button>
            {showEmojiPicker && (
              <Picker
                data={data}
                onEmojiSelect={addEmoji}
                className="emoji-picker"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
