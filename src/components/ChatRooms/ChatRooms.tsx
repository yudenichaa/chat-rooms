import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import firebase from "firebase";
import "./chat-rooms.scss";

interface IChatRooms {}

interface IChatRoom {
    id: string;
    name: string;
    createdBy: string;
    description: string;
    timestamp: firebase.firestore.Timestamp | null;
}

const ChatRooms: React.FC<IChatRooms> = () => {
    const [chatRooms, setChatRooms] = useState<Array<IChatRoom>>([]);
    useEffect(() => {
        db.collection("rooms")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) => {
                setChatRooms(
                    snapshot.docs.map((doc) => {
                        const roomData = doc.data();
                        return {
                            id: doc.id,
                            name: roomData.name,
                            createdBy: roomData.createdBy,
                            description: roomData.description,
                            timestamp: roomData.timestamp,
                        };
                    })
                );
            });
    }, []);

    return (
        <div className="chat-rooms">
            <h1 className="chat-rooms__headline">Rooms</h1>
            <div className="chat-rooms__container">
                {chatRooms.map((room) => {
                    const roomCreationDate = room.timestamp
                        ? new Date(
                              room.timestamp.seconds * 1000
                          ).toLocaleString()
                        : "";
                    return (
                        <Link
                            key={room.id}
                            to={`/room/${room.id}`}
                            className="chat-rooms__room"
                        >
                            <p className="chat-rooms__room-header">
                                Created by {room.createdBy} {roomCreationDate}
                            </p>
                            <h2 className="chat-rooms__room-name">
                                {room.name}
                            </h2>
                            <p className="chat-rooms__room-description">
                                {room.description}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ChatRooms;
