import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar, Button, IconButton, Link } from "@material-ui/core";
import {
  Chat,
  MoreVert,
  Search,
  StackedLineChartOutlined,
} from "@mui/icons-material/";
import * as EmailValidator from "email-validator";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, db, provider } from "../firebaseConfig";
import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Chats from "./Chats";

function Sidebar() {
  const [chatsSnapshot, setChatsSnapshot] = useState([]);

  const [user] = useAuthState(auth);
  // console.log(user);

  const logOut = () => {
    signOut(auth);
  };

  // https://firebase.google.com/docs/firestore/query-data/queries

  // Create a reference to the chats collection
  const userChatRef = collection(db, "chats");
  // console.log({ userChatRef });

  // Create a query against the collection.
  const userChatQuery = query(
    userChatRef,
    where("users", "array-contains", user.email)
  );
  // console.log({ userChatQuery });

  const getChatSnapshot = async () => {
    const querySnapshot = await getDocs(userChatQuery);
    // console.log({ querySnapshot });
    setChatsSnapshot(querySnapshot);
  };

  useEffect(() => {
    getChatSnapshot();
  }, []);

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  const createChat = async () => {
    const input = prompt(
      "Please enter an email address of the user you want to chat with:"
    );
    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // We need to add chat data into the DB 'chats' collection if it doesn't exists and is valid
      const docRef = await addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
      console.log("Document written with ID: ", docRef.id);
    }
  };

  const chatAlreadyExists = (recipientEmail) => {
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );
  };

  return (
    <Container>
      <Header>
        {user?.displayName && (
          <UserAvatar src={user?.photoURL} onClick={handleSignOut} />
        )}
        <IconsContainer>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </IconsContainer>
      </Header>
      <SearchContainer>
        <Search />
        <SearchInput placeholder="Search in chats" />
      </SearchContainer>
      <SidebarButton onClick={createChat}>Star a new chat</SidebarButton>

      {/* List of chats */}
      {chatsSnapshot?.docs?.map((chat) => (
        <Chats key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; // IE and Edge
  scrollbar-width: none; // Firefox
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
