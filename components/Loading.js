import React from "react";
import styled from "styled-components";
import whatsappImg from "../public/assets/whatsapp.png";
import Image from "next/image";
import { Circle } from "better-react-spinkit";

function Loading() {
  return (
    <center style={{ display: "grid", placeItems: "center", height: "100vh" }}>
      <div>
        <Logo>
          <Image src={whatsappImg} alt="WhatsApp" width={200} height={200} />
        </Logo>
        <Circle color="#3CBC28" size={60} />
      </div>
    </center>
  );
}

export default Loading;

const Logo = styled.div`
  position: relative;
  margin-bottom: 50px;
`;
