import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const useAuthState = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [checkState, setCheckState] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true);
      }
      else
      {
        setLoggedIn(false);
      }
      setCheckState(false);
    });
  });
  return { loggedIn, checkState };
};

export default useAuthState;