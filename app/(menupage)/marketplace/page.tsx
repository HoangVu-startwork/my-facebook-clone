"use client";

import React, { useState, useEffect } from "react";
import Auth from "@/service/user";

export default function App() {

  const fetchToken = async () => {
    try {
      const data = await Auth.gettoken();
      console.log(data);
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchToken();
  });
  return (
    <div>
      <div>11</div>
    </div>
  );
}
