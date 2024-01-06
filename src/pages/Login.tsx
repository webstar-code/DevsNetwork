import { getRedirectResult, GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { GITUHB } from "../assets";
import { auth } from "../firebase";
import { useAppDispatach, useAppSelector } from "../hooks/useRedux";
import { IUser } from "../interfaces";
import { createUser } from "../reducer/auth";
import { DotBackground } from "../components/DotBackground";

export function Login() {
  const provider = new GithubAuthProvider();
  provider.addScope('read:user');
  const { user } = useAppSelector(state => state.userSlice);
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

  if (user) {
    const lastLocation = localStorage.getItem("last-location");
    localStorage.removeItem("last-location");
    return <Navigate to={lastLocation || "/"} replace />
  }
  return (
    <div className="relative w-full min-h-screen bg-primary flex flex-col items-center justify-center gap-10">
      <h1 className='text-secondary text-5xl md:text-7xl font-bold -mt-20 mb-10  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 z-20'>
        DEVsNetwork</h1>
      <div className="w-full absolute bottom-0 h-[40rem]">
        <DotBackground>
          <></>
        </DotBackground>
      </div>
      <div className="flex flex-col gap-6 items-center z-20">
        <p className='max-w-sm text-sm md:text-base text-secondary/60 text-center'>
          Login and become part of the global network and start inviting your peers to the network.</p>
        <button onClick={() => login()} className="w-full relative  max-w-[300px] h-10 bg-primary border rounded-md flex items-center justify-center cursor-pointer">
          <p className="text-sm md:text-base text-primary-foreground mr-2">Login with GitHub</p>
          <img src={GITUHB} className="w-6 h-5" />
          <span className="absolute inset-x-0 w-4/5 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px]" />
        </button>
      </div>
    </div>
  )
}