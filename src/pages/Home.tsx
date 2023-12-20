import { getRedirectResult, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { useEffect } from "react";
import { GITUHB } from "../assets";
import { auth } from "../firebase";
import { useAppDispatach } from "../hooks/useRedux";
import { IUser } from "../interfaces";
import { createUser } from "../reducer/auth";

export function Home() {
  const provider = new GithubAuthProvider();
  provider.addScope('read:user');
  const dispatch = useAppDispatach();

  function login() {
    signInWithRedirect(auth, provider);
  }

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (!result) return;
        // The signed-in user info.
        const user = result.user;
        const newUser: IUser = {
          id: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          photoUrl: user.photoURL || "",
          createdAt: new Date().toDateString(),
          lastLoginAt: new Date().toDateString(),
        }
        dispatch(createUser(newUser));
      }).catch((error) => {
        console.error(error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
      });
  }, []);


  return (
    <div className="w-full min-h-screen bg-primary flex flex-col items-center justify-center gap-10">
      <h1 className='text-secondary text-7xl font-bold'>DEVsNetwork</h1>
      <p className='text-base text-secondary'>Start creating your network by logging in below</p>
      <div onClick={() => login()} className="w-full max-w-[320px] h-10 bg-primary border rounded-md flex items-center justify-center cursor-pointer">
        <p className="text-base text-primary-foreground mr-2">Login with GitHub</p>
        <img src={GITUHB} className="w-6 h-5" />
      </div>
    </div>
  )
}