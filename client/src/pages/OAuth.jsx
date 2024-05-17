import React, { useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router";
import { SyncLoader } from "react-spinners";

function OAuth() {
  const navigate = useNavigate();
  const { loginWithOAuth } = useLogin();

  useEffect(() => {
    loginWithOAuth();
  }, []);

  return (
    <div className="flex items-center justify-center mt-[50vh]">
      <SyncLoader />
    </div>
  );
}

export default OAuth;
