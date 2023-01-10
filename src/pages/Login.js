import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userSlice";

const Login = () => {
  const auth = getAuth();
  const db = getDatabase();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [passwordShow, setPasswordShow] = useState(false);
  let [emailErr, setEmailErr] = useState("");
  let [passwordErr, setPasswordErr] = useState("");
  let [success, setSuccess] = useState("");
  let [loading, setLoading] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };
  let handleSubmit = () => {
    const re0 =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const re = /^(?=.*[a-z])/;
    const re2 = /^(?=.*[A-Z])/;
    const re3 = /^(?=.*[0-9])/;
    const re4 = /^(?=.*[!@#$%^&*])/;
    const re5 = /^(?=.{8,})/;

    if (!email) {
      setEmailErr("Email is required");
    } else {
      if (!re0.test(email)) {
        setEmailErr("Please enter a valid email");
      }
    }
    if (!password) {
      setPasswordErr("Password is required");
    } else {
      if (!re.test(password)) {
        setPasswordErr(
          "Password must contain at least 1 lowercase alphabetical character"
        );
      }
      if (!re2.test(password)) {
        setPasswordErr(
          "Password must contain at least 1 uppercase alphabetical character"
        );
      }
      if (!re3.test(password)) {
        setPasswordErr("Password must contain at least 1 numeric character");
      }
      if (!re4.test(password)) {
        setPasswordErr("Password must contain at least one special character");
      }
      if (!re5.test(password)) {
        setPasswordErr("Password must be eight characters or longer");
      }
      if (
        email &&
        password &&
        re0.test(email) &&
        re.test(password) &&
        re2.test(password) &&
        re3.test(password) &&
        re4.test(password) &&
        re5.test(password)
      ) {
        setLoading(true);
        signInWithEmailAndPassword(auth, email, password)
          .then((user) => {
            setLoading(false);
            toast.success("Login Successful");
            dispatch(userLoginInfo(user.user));
            localStorage.setItem("userInfo", JSON.stringify(user.user));
            setTimeout(() => {
              navigate("/");
            }, 5000);
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (error.code.includes("auth/user-not-found")) {
              toast.error("User not found");
            }
            if (error.code.includes("auth/wrong-password")) {
              toast.error("Password not matched");
            }
            setLoading(false);
          });
      }
    }
  };
  let handleGoogleSignIn = () => {
    signInWithPopup(auth, provider).then((user) => {
      set(ref(db, "users/" + user.user.uid), {
        username: user.user.displayName,
        email: user.user.email,
      });
      toast.success("Login Successful");
      dispatch(userLoginInfo(user.user));
      localStorage.setItem("userInfo", JSON.stringify(user.user));
      setTimeout(() => {
        navigate("/");
      }, 5000);
    });
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex">
        <div className="flex w-[52.5%] items-center justify-end">
          <div className="mr-[69px]">
            <h3 className="nunito text-[34.4px] font-bold text-primary">
              Login to your account!
            </h3>
            <button
              onClick={handleGoogleSignIn}
              className="border-border-box mt-5 flex w-56 cursor-pointer border border-solid px-8 py-5"
            >
              <picture className="mr-2.5">
                <img src="images/google.png" alt="Google" />
              </picture>
              <p className="sans text-sm font-semibold text-account">
                Login with google
              </p>
            </button>
            <div className="relative mt-[61.5px]">
              <input
                onChange={handleEmail}
                type="email"
                className="border-border-box placeholder:nunito w-[368px] border-b border-solid py-7 outline-none placeholder:text-xl placeholder:font-semibold placeholder:text-primary"
                placeholder="example@email.com"
                value={email}
              ></input>
              <p className="nunito absolute top-[-10px] left-0 bg-white text-sm font-semibold text-primary">
                Email Address
              </p>
              {emailErr && (
                <p className="nunito text-sm font-semibold text-red-500">
                  {emailErr}
                </p>
              )}
            </div>
            <div className="relative mt-14 w-[368px]">
              <input
                onChange={handlePassword}
                type={passwordShow ? "text" : "password"}
                className="border-border-box placeholder:nunito relative w-[368px] border-b border-solid py-7 outline-none placeholder:text-xl placeholder:font-semibold placeholder:text-primary"
                placeholder="******"
                value={password}
              ></input>
              <p className="nunito absolute top-[-10px] left-0 bg-white text-sm font-semibold text-primary">
                Password
              </p>
              {passwordShow ? (
                <RiEyeCloseFill
                  onClick={() => setPasswordShow(!passwordShow)}
                  className="absolute top-[43%] right-6"
                />
              ) : (
                <RiEyeFill
                  onClick={() => setPasswordShow(!passwordShow)}
                  className="absolute top-[35%] right-6"
                />
              )}
              {passwordErr && (
                <p className="nunito text-sm font-semibold text-red-500">
                  {passwordErr}
                </p>
              )}
            </div>
            {loading ? (
              <button
                onClick={handleSubmit}
                className="nunito mt-[52px] flex w-[368px] justify-center rounded-lg bg-button py-5 text-xl font-semibold text-white"
              >
                <Circles
                  height="28"
                  width="28"
                  color="#fff"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="nunito mt-[52px] w-[368px] rounded-lg bg-button py-5 text-xl font-semibold text-white"
              >
                Login to Continue
              </button>
            )}

            <p className="sans mt-9 w-[368px] text-left text-sm font-normal text-account">
              Don’t have an account ?
              <Link to="/registration" className="font-bold text-sign-up">
                Sign Up
              </Link>
            </p>
            <p className="sans mt-9 w-[368px] text-center text-sm font-normal text-account">
              <Link to="/forgot-password" className="font-bold text-sign-up">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
        <div className="h-screen w-[47.5%]">
          <picture>
            <img
              src="images/login.png"
              alt=""
              className="h-screen w-full object-cover"
            />
          </picture>
        </div>
      </div>
    </>
  );
};

export default Login;
