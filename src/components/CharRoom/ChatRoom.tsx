import React, { useState, useCallback, useEffect, useRef } from "react";
import { db } from "../../firebase";
import firebase from "firebase";
import "./chat-room.scss";

interface IChatRoom {
    user: firebase.User | null;
    roomName: string;
    height: number;
}

interface IMessage {
    id?: string;
    message: string;
    userName: string;
    timestamp: firebase.firestore.Timestamp | null;
}

firebase.firestore.FieldValue.serverTimestamp;

const ChatRoom: React.FC<IChatRoom> = ({ user, roomName, height }) => {
    const [messages, setMessages] = useState<Array<IMessage>>([]);
    useEffect(() => {
        db.collection("messages")
            .orderBy("timestamp", "asc")
            .onSnapshot((snapshot) => {
                setMessages(
                    snapshot.docs.map((doc) => {
                        const messageData = doc.data();
                        return {
                            id: doc.id,
                            message: messageData.message,
                            userName: messageData.userName,
                            timestamp: messageData.timestamp,
                        };
                    })
                );
            });
    }, []);

    const messagesRef = useRef<HTMLDivElement | null>();
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
    useEffect(() => {
        if (messagesRef && scrollToBottom) {
            setScrollToBottom(false);
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [scrollToBottom]);

    const [message, setMessage] = useState<string>("");

    const onMessageChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(event.target.value),
        []
    );

    const onPostMessage = useCallback(
        (event: React.MouseEvent | React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (message) {
                db.collection("messages")
                    .add({
                        message,
                        userName: user.displayName,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then(() => {
                        setMessage("");
                        setScrollToBottom(true);
                    })
                    .catch((error) => alert(error.message));
            }
        },
        [message, user]
    );

    return (
        <div
            className="chat-room"
            style={{
                maxHeight: `${height}px`,
            }}
        >
            <div className="chat-room__content">
                <h1 className="chat-room__name">{roomName}</h1>
                <div className="chat-room__messages" ref={messagesRef}>
                    {messages.map((message) => {
                        const messageDate = message.timestamp
                            ? new Date(
                                  message.timestamp.seconds * 1000
                              ).toLocaleString()
                            : "";
                        return (
                            <div
                                key={message.id}
                                className="chat-room__message"
                            >
                                <div className="chat-room__message__header">
                                    {messageDate}
                                </div>
                                <p className="chat-room__message-text">
                                    <span className="chat-room__message-user">
                                        {message.userName}
                                    </span>
                                    {": "}
                                    {message.message}
                                </p>
                            </div>
                        );
                    })}
                </div>
                {user && (
                    <form
                        onSubmit={onPostMessage}
                        className="chat-room__post-message-form"
                    >
                        <input
                            value={message}
                            onChange={onMessageChange}
                            type="text"
                            className="chat-room__message-input"
                        />
                        <button
                            onClick={onPostMessage}
                            className="chat-room__post-message-button"
                        />
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChatRoom;
