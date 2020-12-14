import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";
import { Button } from "@material-ui/core";
import SignUpModal from "../SignUpModal";
import SignInModal from "../SignInModal";
import firebase from "firebase/app";
import logo from "../../assets/logo.svg";
import "./header.scss";

interface IHeader {
    user: firebase.User;
}

const Header = React.forwardRef<HTMLDivElement, IHeader>(({ user }, ref) => {
    const [signUpModalOpen, setSignUpModalOpen] = useState<boolean>(false);
    const openSignUpModal = useCallback(() => setSignUpModalOpen(true), []);
    const closeSignUpModal = useCallback(() => setSignUpModalOpen(false), []);

    const [signInModalOpen, setSignInModalOpen] = useState<boolean>(false);
    const openSignInModal = useCallback(() => setSignInModalOpen(true), []);
    const closeSignInModal = useCallback(() => setSignInModalOpen(false), []);

    const signOut = () => auth.signOut();

    return (
        <div ref={ref} className="header">
            <Link to="/">
                <img
                    className="header__logo-image"
                    src={`/${logo}`}
                    alt="logo"
                />
            </Link>
            {user ? (
                <Button onClick={signOut} color="primary">
                    Sign out
                </Button>
            ) : (
                <span>
                    <Button onClick={openSignUpModal} color="primary">
                        Sign up
                    </Button>
                    <Button onClick={openSignInModal} color="primary">
                        Sign in
                    </Button>
                    <SignUpModal
                        signUpModalOpen={signUpModalOpen}
                        closeSignUpModal={closeSignUpModal}
                    />
                    <SignInModal
                        signInModalOpen={signInModalOpen}
                        closeSignInModal={closeSignInModal}
                    />
                </span>
            )}
        </div>
    );
});

export default Header;
