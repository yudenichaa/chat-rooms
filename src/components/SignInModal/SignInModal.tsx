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
import "./sign-in-modal.scss";

const useStyles = makeStyles(() => ({
    SignIn__Input: {
        width: "100%",
        marginTop: "0.8rem",
    },
    SignIn__Button: {
        marginTop: "0.8rem",
    },
}));

interface ISignInModal {
    signInModalOpen: boolean;
    closeSignInModal: () => void;
}

const SignInModal: React.FC<ISignInModal> = ({
    signInModalOpen,
    closeSignInModal,
}) => {
    const classes = useStyles();
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");

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

    const onSignIn = useCallback(
        (event: React.FormEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            auth.signInWithEmailAndPassword(userEmail, userPassword)
                .then(closeSignInModal)
                .catch((error) => alert(error.message));
        },
        [userEmail, userPassword]
    );

    return (
        <Modal
            open={signInModalOpen}
            onClose={closeSignInModal}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={signInModalOpen}>
                <form onSubmit={onSignIn} className="sign-in-modal">
                    <img
                        className="sign-in-modal__image"
                        src={logo}
                        alt="logo"
                    />
                    <Input
                        className={classes.SignIn__Input}
                        type="email"
                        placeholder="Email"
                        value={userEmail}
                        onChange={onUserEmailChange}
                        autoFocus
                    />
                    <Input
                        className={classes.SignIn__Input}
                        type="password"
                        placeholder="Password"
                        value={userPassword}
                        onChange={onUserPasswordChange}
                    />
                    <Button
                        type="submit"
                        className={classes.SignIn__Button}
                        onSubmit={onSignIn}
                        color="primary"
                    >
                        Sign in
                    </Button>
                </form>
            </Fade>
        </Modal>
    );
};

export default SignInModal;
