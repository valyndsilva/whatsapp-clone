import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@material-ui/core";
import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
} from "@mui/icons-material/";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import Message from "./Message";
import * as firebase from "firebase/app";
import getRecipientEmail from "../utils/getRecipientEmail";

function ChatScreen({ chat, chat_id, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const router = useRouter();
  const [messagesSnapshot, setMessagesSnapshot] = useState([]);

  // Create a reference to the chats collection
  const userMessagesRef = collection(db, "chats", router.query.id, "messages");
  // console.log({ userChatRef });

  // Create a query against the collection.
  const userMessagesQuery = query(userMessagesRef, orderBy("timestamp", "asc"));
  // console.log({ userChatQuery });

  const getMessagesSnapshot = async () => {
    const querySnapshot = await getDocs(userMessagesQuery);
    // console.log({ querySnapshot });
    setMessagesSnapshot(querySnapshot);
  };

  useEffect(() => {
    getMessagesSnapshot();
  }, []);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs?.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} message={message} user={message.user} />
      ));
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    //Update last seen...
    const userRef = doc(db, "users", user.uid);
    const payload = {
      lastSeen: serverTimestamp(),
    };
    await setDoc(userRef, payload, { merge: true });

    const chatRef = collection(db, "chats", router.query.id, "messages");
    const payload1 = {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    };
    await addDoc(chatRef, payload1);
    setInput("");
  };

//   const recipientEmail=getRecipientEmail(chat.users,user);
  return (
    <Container>
      <Header>
        <Avatar />
        <HeaderInfo>
          <h3>Recipient Email</h3>
          <p>Last seen...</p>
        </HeaderInfo>
        <HeaderIcons>
          <IconButton>
            <MoreVert />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {/* Show messages */}
        {showMessages()}
        <EndOfMessage />
      </MessageContainer>

      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: #fff;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  pad: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  position: sticky;
  padding: 10px;
  bottom: 0;
  background-color: #fff;
  z-index: 100;
`;

const Input = styled.input`
  cursor: pointer;
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  padding: 20px;
  background-color: whitesmoke;
  margin-left: 15px;
  margin-right: 15px;
`;
