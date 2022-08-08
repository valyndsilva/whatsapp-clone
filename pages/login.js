import { Button } from "@material-ui/core";
import Head from "next/head";
import React from "react";
import styled from "styled-components";
import whatsappImg from "../public/assets/whatsapp.png";
import Image from "next/image";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { auth, provider } from "../firebaseConfig";

function login() {
  const googleSignIn = () => {
    // signInWithPopup(auth, provider);
    signInWithRedirect(auth, provider);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <Head>Login</Head>
      <LoginContainer>
        <Logo>
          <Image src={whatsappImg} alt="WhatsApp" width={200} height={200} />
        </Logo>
        <Button variant="outlined" onClick={handleGoogleSignIn}>
          Login with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default login;

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 8px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.div`
  position: relative;
  margin-bottom: 50px;
`;
