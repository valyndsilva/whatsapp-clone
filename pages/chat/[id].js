import {
  doc,
  collection,
  query,
  getDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Head from "next/head";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import { auth, db } from "../../firebaseConfig";
import getRecipientEmail from "../../utils/getRecipientEmail";

function Chat({ messages, chat, id }) {
  console.log({ id });
  console.log({ chat });
  console.log({ messages });
  const [user] = useAuthState(auth);
  console.log(user);
  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} chat_id={id} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default Chat;

export async function getServerSideProps(context) {
  // Prep messages on the server
  const messagesRef = collection(db, "chats", context.query.id, "messages");
  console.log({ messagesRef });

  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);

  //   const messages = querySnapshot.docs.map((doc) => ({
  //     ...doc.data(),
  //     id: doc.id,
  //     timestamp: doc.data().timestamp?.toDate().getTime(),
  //   }));

  const messages = querySnapshot.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp?.toDate().getTime(),
    }));

  const chatRef = doc(db, "chats", context.query.id);
  const chatSnapshot = await getDoc(chatRef);
  console.log(JSON.stringify(chatSnapshot.data()));

  //   const chat = {
  //     id: chatSnapshot.id,
  //     ...chatSnapshot.data(),
  //   };
  //   console.log(chat, messages);

  //cannot use snapshot .data() on server side
  //Very Important: We loose the timeStamp data type when you send info from the API(backend) to the client(frontend).

  return {
    props: {
      id: context.query.id,
      chat: chatSnapshot.data(),
      messages: JSON.stringify(messages),
    },
  };
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /*IE and <Edge></Edge>
  scrollbar-width:none; /*Firefox*/
`;
