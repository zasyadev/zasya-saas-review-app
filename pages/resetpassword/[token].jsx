import React from "react";
import { useRouter } from "next/router";

function resetPassword() {
  const router = useRouter();
  const { token } = router.query;
  console.log(token, "token");
  return (
    <div>
      <h1>he;llo</h1>
    </div>
  );
}

export default resetPassword;
