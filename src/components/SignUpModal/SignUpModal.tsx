import React, { useState, useCallback } from "react";
import {
    Modal,
    Button,
    Input,
    Backdrop,
    Fade,
    makeStyles,
} from "@material-ui/core/";
import { auth } from "../../firebase";
import logo from "../../assets/logo.svg";
import "./sign-up-modal.scss";

const useStyles = makeStyles(() => ({
    SignUp__Input: {
        width: "100%",
        marginTop: "0.8rem",
    },
    SignUp__Button: {
        marginTop: "0.8rem",
    },
}));

interface ISignUpModal {
    signUpModalOpen: boolean;
    closeSignUpModal: () => void;
}

const SignUpModal: React.FC<ISignUpModal> = ({
    signUpModalOpen,
    closeSignUpModal,
}) => {
    const classes = useStyles();
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");

    const onUserNameChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(event.target.value),
        []
    );

    const onUserEmailChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setUserEmail(event.target.value),
        []
    );

    const onUserPasswordChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) =>
            setUserPassword(event.target.value),
        []
    );

    const onSignUp = useCallback(
        (event: React.MouseEvent | React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!userName) {
                alert("Enter name");
                return;
            }
            auth.createUserWithEmailAndPassword(userEmail, userPassword)
                .then((authUser) => {
                    return authUser.user.updateProfile({
                        displayName: userName,
                    });
                })
                .then(closeSignUpModal)
                .catch((error) => alert(error.message));
        },
        [userName, userEmail, userPassword]
    );

    return (
        <Modal
            open={signUpModalOpen}
            onClose={closeSignUpModal}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={signUpModalOpen}>
                <form onSubmit={onSignUp} className="sign-up-modal">
                    <img
                        className="sign-in-modal__image"
                        src={logo}
                        alt="logo"
                    />
                    <Input
                        className={classes.SignUp__Input}
                        type="text"
                        placeholder="Name"
                        value={userName}
                        onChange={onUserNameChange}
                        autoFocus
                    />
                    <Input
                        className={classes.SignUp__Input}
                        type="email"
                        placeholder="Email"
                        value={userEmail}
                        onChange={onUserEmailChange}
                    />
                    <Input
                        className={classes.SignUp__Input}
                        type="password"
                        placeholder="Password"
                        value={userPassword}
                        onChange={onUserPasswordChange}
                    />
                    <Button
                        type="submit"
                        className={classes.SignUp__Button}
                        onClick={onSignUp}
                        color="primary"
                    >
                        Sign up
                    </Button>
                </form>
            </Fade>
        </Modal>
    );
};

export default SignUpModal;
