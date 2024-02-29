"use client";
import { signOut } from "next-auth/react";
import React from "react";

const Signout = () => {
  return (
    <button onClick={() => signOut({ callbackUrl: "/", redirect: true })}>
      signout
    </button>
  );
};

export default Signout;
