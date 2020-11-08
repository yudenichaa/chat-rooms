import React, { useState, useEffect } from "react";
import Header from "../Header";
import ChatRoom from "../CharRoom";
import { auth } from "../../firebase";
import firebase from "firebase";
import { useClientRect } from "../../customHooks";
import "./app.scss";

interface IApp {}

const App: React.FC<IApp> = () => {
    const [user, setUser] = useState<null | firebase.User>(null);
    const [headerRect, headerRef] = useClientRect();
    const [chatRoomHeight, setChatRoomHeight] = useState<number>(0);

    useEffect(() => {
        headerRect && setChatRoomHeight(window.innerHeight - headerRect.height);
    }, [headerRect]);

    useEffect(() => {
        const updateChatRoomHeight = () => {
            headerRect &&
                setChatRoomHeight(window.innerHeight - headerRect.height);
        };
        window.addEventListener("resize", updateChatRoomHeight);
        return () => {
            window.removeEventListener("resize", updateChatRoomHeight);
        };
    }, [headerRect]);

    useEffect(() => {
        return auth.onAuthStateChanged((authUser) => {
            authUser ? setUser(authUser) : setUser(null);
        });
    }, []);

    return (
        <div className="app">
            <Header ref={headerRef} user={user} />
            <ChatRoom user={user} roomName="Беседка" height={chatRoomHeight} />
        </div>
    );
};

export default App;
