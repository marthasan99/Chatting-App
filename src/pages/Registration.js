import React, { useState } from "react";
import { RiEyeCloseFill, RiEyeFill } from "react-icons/ri";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { Circles } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database";
// import { userLoginInfo } from '../slices/userSlice';

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [fullName, setFullName] = useState("");
  let [password, setPassword] = useState("");
  let [passwordShow, setPasswordShow] = useState(false);

  let [emailErr, setEmailErr] = useState("");
  let [fullNameErr, setFullNameErr] = useState("");
  let [passwordErr, setPasswordErr] = useState("");
  let [success, setSuccess] = useState("");
  let [loading, setLoading] = useState(false);

  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  let handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameErr("");
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
    if (!fullName) {
      setFullNameErr("Full Name is required");
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
        fullName &&
        password &&
        re0.test(email) &&
        re.test(password) &&
        re2.test(password) &&
        re3.test(password) &&
        re4.test(password) &&
        re5.test(password)
      ) {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            updateProfile(auth.currentUser, {
              displayName: fullName,
              photoURL: "images/demo-profile.jpg",
            })
              .then(() => {
                toast.success(
                  "Registration Successful. Please verify your email"
                );
                setEmail("");
                setFullName("");
                setPassword("");
                sendEmailVerification(auth.currentUser);
                setLoading(false);

                setTimeout(() => {
                  navigate("/login");
                }, 4000);
              })
              .catch((error) => {
                console.log(error);
              })
              .then(() => {
                set(ref(db, "users/" + user.user.uid), {
                  username: user.user.displayName,
                  email: user.user.email,
                });
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode.includes("auth/email-already-in-use")) {
              setEmailErr("Email already in use");
            }
            setLoading(false);
          });
      }
    }
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
      <div className="mx-auto max-w-[90%] md:flex  md:max-w-full">
        <div className="flex items-center justify-end md:w-[52.5%]">
          <div className=" w-full px-0 md:w-auto  md:px-2 lg:mr-[69px] lg:px-0">
            <h3 className="nunito text-center text-2xl font-bold text-primary md:text-left lg:text-[34.4px]">
              Get started with easily register
            </h3>
            <p className="nunito mb-15 mt-3 text-center text-base font-normal text-input-box md:text-left md:text-xl">
              Free register and you can enjoy it
            </p>
            <div className="relative mt-[61.5px]">
              <input
                onChange={handleEmail}
                type="email"
                className="border-border-box placeholder:nunito w-full rounded-lg border border-solid py-7 px-12 placeholder:text-base placeholder:font-semibold placeholder:text-primary md:w-[368px] placeholder:md:text-xl"
                placeholder="example@email.com"
                value={email}
              ></input>
              <p className="nunito absolute top-[-10px] left-[34px] bg-white px-4 text-sm font-semibold text-primary">
                Email Address
              </p>
              {emailErr && (
                <p className="nunito text-sm font-semibold text-red-500">
                  {emailErr}
                </p>
              )}
            </div>
            <div className="relative mt-14">
              <input
                onChange={handleFullName}
                type="text"
                className="border-border-box placeholder:nunito w-full rounded-lg border border-solid py-7 px-12 placeholder:text-base placeholder:font-semibold placeholder:text-primary md:w-[368px] placeholder:md:text-xl"
                placeholder="Full name here"
                value={fullName}
              ></input>
              <p className="nunito absolute top-[-10px] left-[34px] bg-white px-4 text-sm font-semibold text-primary">
                Full Name
              </p>
              {fullNameErr && (
                <p className="nunito text-sm font-semibold text-red-500">
                  {fullNameErr}
                </p>
              )}
            </div>
            <div className="relative mt-14 w-full md:w-[368px]">
              <input
                onChange={handlePassword}
                type={passwordShow ? "text" : "password"}
                className="border-border-box placeholder:nunito relative w-full rounded-lg border border-solid py-7 px-12 placeholder:text-base placeholder:font-semibold placeholder:text-primary md:w-[368px] placeholder:md:text-xl"
                placeholder="******"
                value={password}
              ></input>
              <p className="nunito absolute top-[-10px] left-[34px] bg-white px-4 text-sm font-semibold text-primary">
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
                className="nunito mt-[52px] flex w-full justify-center rounded-[86px] bg-button py-5 text-xl font-semibold text-white md:w-[368px]"
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
                className="nunito mt-[52px] w-full rounded-[86px] bg-button py-5 text-base font-semibold text-white md:w-[368px] md:text-xl"
              >
                Sign Up
              </button>
            )}

            <p className="sans mt-9 w-full text-center text-sm font-normal text-account md:w-[368px]">
              Already have an account ?{" "}
              <Link to="/login" className="font-bold text-sign-up">
                Sign In
              </Link>
            </p>
          </div>
        </div>
        <div className="hidden md:block md:h-screen md:w-[47.5%]">
          <picture>
            <img
              src="images/registration.png"
              alt=""
              className="h-screen w-full object-cover"
            />
          </picture>
        </div>
      </div>
    </>
  );
};

export default Registration;
