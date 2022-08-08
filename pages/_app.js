import "../styles/globals.css";
import { auth, db } from "../firebaseConfig.js";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "../pages/login";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { collection, setDoc, doc } from "firebase/firestore";
function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const handleUser = async () => {
      if (user) {
        // console.log("User", user);
        const docRef = doc(db, "users", user.uid);
        const payload = {
          email: user.email,
          lastSeen: new Date(),
          photoURL: user.photoURL,
        };
        await setDoc(docRef, payload, { merge: true });
      }
    };
    handleUser();
  }, [user]);
  // To fix hydration UI mismatch issues, we need to wait until the component has mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
