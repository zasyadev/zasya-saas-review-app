import "../styles/globals.css";
import "../styles/customantd.scss";
// import "antd/dist/antd.css";
// import { useSession } from "next-auth/client";

function MyApp({ Component, pageProps }) {
  // const [session] = useSession();
  // if (session) {
  return (
    <Component
      {...pageProps}

      // session={session}
    />
  );
  // }
  // return null;
}

export default MyApp;
