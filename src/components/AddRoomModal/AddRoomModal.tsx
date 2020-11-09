import React, { useState, useCallback, useEffect } from "react";
import firebase from "firebase";
import { db } from "../../firebase";
import addRoomIcon from "../../assets/plus.svg";
import config from "../../config";
import "./add-room-modal.scss";

interface IAddRoomModal {
    user: firebase.User | null;
    isOpen: boolean;
    onClose: () => void;
}

const AddRoomModal: React.FC<IAddRoomModal> = ({ user, isOpen, onClose }) => {
    const [roomName, setRoomName] = useState<string>("");
    const [roomDescription, setRoomDescription] = useState("");
    const [addButtonDisabled, setAddButtomDisabled] = useState(false);

    const [modalOpacity, setModalOpacity] = useState(+isOpen);
    useEffect(() => setModalOpacity(+isOpen), [isOpen]);

    const closeModal = useCallback(() => {
        setModalOpacity(0);
        setTimeout(() => onClose(), config.modalTransitionTime);
    }, [onClose]);

    const onRoomNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setRoomName(event.target.value),
        []
    );

    const onRoomDescriptionChange = useCallback(
        (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            setRoomDescription(event.target.value),
        []
    );

    const onAddRoomClick = useCallback(
        (
            event:
                | React.FormEvent<HTMLButtonElement>
                | React.FormEvent<HTMLFormElement>
        ) => {
            event.preventDefault();
            if (!roomName || !roomDescription) {
                alert("Enter room name and description");
                return;
            }
            setAddButtomDisabled(true);
            db.collection("rooms")
                .add({
                    name: roomName,
                    description: roomDescription,
                    createdBy: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                })
                .then(() => {
                    setRoomName("");
                    setRoomDescription("");
                    closeModal();
                })
                .catch((error) => alert(error.message))
                .finally(() => setAddButtomDisabled(false));
        },
        [roomName, roomDescription]
    );

    const onModalClick = useCallback(
        (event: React.MouseEvent) =>
            event.target == event.currentTarget && closeModal(),
        [closeModal]
    );

    return (
        <>
            {isOpen && (
                <div
                    style={{
                        opacity: modalOpacity,
                        transition: `opacity ${config.modalTransitionTime}ms`,
                    }}
                    onClick={onModalClick}
                    className="add-room-modal"
                >
                    <form
                        onSubmit={onAddRoomClick}
                        className="add-room-modal__form"
                    >
                        <h2 className="add-room-modal__form-headline">
                            Add room
                        </h2>
                        <label className="add-room-modal__label">
                            Room name:
                        </label>
                        <input
                            value={roomName}
                            onChange={onRoomNameChange}
                            type="text"
                            className="add-room-modal__name-input"
                        />
                        <label className="add-room-modal__label">
                            Room description:
                        </label>
                        <textarea
                            value={roomDescription}
                            onChange={onRoomDescriptionChange}
                            className="add-room-modal__description-input"
                        />
                        <button
                            onSubmit={onAddRoomClick}
                            disabled={addButtonDisabled}
                            type="submit"
                            className="add-room-modal__add-button"
                            style={{
                                backgroundImage: `url(/${addRoomIcon})`,
                            }}
                        />
                    </form>
                </div>
            )}
        </>
    );
};

export default AddRoomModal;
