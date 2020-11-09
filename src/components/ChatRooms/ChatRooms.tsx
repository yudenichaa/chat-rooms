import React, { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { Link } from "react-router-dom";
import AddRoomModal from "../AddRoomModal";
import firebase from "firebase";
import "./chat-rooms.scss";
import addRoomIcon from "../../assets/plus.svg";

interface IChatRooms {
    user: firebase.User | null;
}

interface IChatRoom {
    id: string;
    name: string;
    createdBy: string;
    description: string;
    timestamp: firebase.firestore.Timestamp | null;
}

const ChatRooms: React.FC<IChatRooms> = ({ user }) => {
    const [chatRooms, setChatRooms] = useState<Array<IChatRoom>>([]);
    useEffect(() => {
        return db
            .collection("rooms")
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

    const [addRoomModalOpen, setAddRoomModalOpen] = useState<boolean>(false);
    const openAddRoomModal = useCallback(() => setAddRoomModalOpen(true), []);
    const closeAddRoomModal = useCallback(() => setAddRoomModalOpen(false), []);

    return (
        <>
            <AddRoomModal
                user={user}
                isOpen={addRoomModalOpen}
                onClose={closeAddRoomModal}
            />
            <div className="chat-rooms">
                <h1 className="chat-rooms__headline">Rooms</h1>
                {user && (
                    <button
                        onClick={openAddRoomModal}
                        className="chat-rooms__add-room-button"
                        style={{
                            backgroundImage: `url(/${addRoomIcon})`,
                        }}
                    />
                )}
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
                                    Created by {room.createdBy}{" "}
                                    {roomCreationDate}
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
        </>
    );
};

export default ChatRooms;
