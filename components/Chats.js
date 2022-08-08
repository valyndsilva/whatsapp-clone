import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";

function Chats({ id, users }) {
  const router = useRouter();
  const [recipientSnapshot, setRecipientSnapshot] = useState([]);
  const [user] = useAuthState(auth);

  // Create a reference to the chats collection
  const recipientRef = collection(db, "users");
  // console.log({ recipientRef });

  // Create a query against the collection.
  const recipientQuery = query(
    recipientRef,
    where("email", "==", getRecipientEmail(users, user))
  );
  // console.log({ recipientQuery });

  const getRecipientSnapshot = async () => {
    const queryRecipientSnapshot = await getDocs(recipientQuery);
    // console.log({ queryRecipientSnapshot });
    setRecipientSnapshot(queryRecipientSnapshot);
  };

  useEffect(() => {
    getRecipientSnapshot();
  }, []);

  // const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  // console.log(recipient);
  const recipientEmail = getRecipientEmail(users, user);
  // console.log({ recipientEmail });

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient?.photoURL ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}

      <p> {recipientEmail}</p>
    </Container>
  );
}

export default Chats;

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
