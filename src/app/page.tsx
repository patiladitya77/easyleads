"use client";
import { useRef, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { validateData } from "@/lib/validate";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isSignInForm, setIsSignInForm] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>("");
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    const message = validateData(
      email?.current!.value,
      password.current!.value
    );
    setErrorMessage(message);
    if (message) return;
    if (isSignInForm) {
      //signin logic

      signInWithEmailAndPassword(
        auth,
        email.current!.value,
        password.current!.value
      )
        .then(() => {
          // Signed in
          router.push("/home/buyers");
        })
        .catch(() => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          setErrorMessage("Please enter valid credentials");
        });
    } else {
      //signup logic

      createUserWithEmailAndPassword(
        auth,
        email.current!.value,
        password.current!.value
      )
        .then((userCredential) => {
          router.push("/home/buyers");
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current!.value,
          })
            .then(() => {
              if (auth.currentUser) {
                const { uid, displayName, email, photoURL } = auth.currentUser;
              }
            })
            .catch(() => {
              setErrorMessage("Please enter valid Credentials");
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + " - " + errorMessage);
        });
    }
  };

  return (
    <div className="">
      <div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-2/3 md:w-3/12 absolute my-36 p-12 bg-black mx-auto right-0 left-0 text-white rounded-lg bg-opacity-80"
        >
          <p className="font-bold text-3xl py-4 ">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </p>
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-2 my-2 w-full bg-gray-800 rounded-lg"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email"
            className="p-2 my-2 w-full bg-gray-800 rounded-lg"
          />
          <input
            ref={password}
            type="password"
            placeholder="Password"
            className=" bg-gray-800 my-4 p-2 w-full rounded-lg"
          />
          <p className="text-red-400 font-bold">{errorMessage}</p>
          <button
            className=" w-full p-2 my-4 bg-red-600 rounded-lg cursor-pointer"
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
          <p
            className="m-2 cursor-pointer"
            onClick={() => setIsSignInForm(!isSignInForm)}
          >
            {isSignInForm
              ? "New user? Sign up now"
              : "Already have an account? Login here"}
          </p>
        </form>
      </div>
    </div>
  );
}
