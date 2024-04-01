import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthState } from "../../context/auth";

function Main() {
  const navigate = useNavigate();
  // const { authenticated, user } = useAuthState();
  // useEffect(() => {
  //   if (!authenticated) {
  //     navigate("/login");
  //   }
  // });

  return (
    <>
      <div>Main</div>
    </>
  );
}

export default Main;
