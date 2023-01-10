import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  let [email, setEmail] = useState("");
  let handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Recovery email sent");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.warn("Email is not registered. Please register");
        setTimeout(() => {
          navigate("/registration");
        }, 3000);
      });
  };
  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="flex h-screen w-full items-center justify-center bg-primary">
        <div className="w-[400px] rounded bg-white">
          <h3 className="nunito text-center text-[34.4px] font-bold text-primary">
            Reset your password
          </h3>
          <div className="relative mt-[61.5px] flex justify-center">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="border-border-box placeholder:nunito w-[368px] rounded-lg border border-solid py-7 px-12 placeholder:text-xl placeholder:font-semibold placeholder:text-primary"
              placeholder="example@email.com"
              value={email}
            ></input>
            <p className="nunito absolute top-[-10px] left-[34px] bg-white px-4 text-sm font-semibold text-primary">
              Email Address
            </p>
          </div>
          <div className="mx-auto flex w-[368px] justify-between gap-2">
            <button
              onClick={handleForgotPassword}
              className="nunito mx-auto mt-[52px] block w-[368px] rounded-lg bg-button py-5 text-xl font-semibold text-white"
            >
              Update
            </button>
            <button className="nunito mx-auto mt-[52px] block w-[368px] rounded-lg bg-button py-5 text-xl font-semibold text-white">
              <Link to="/login">Back to Login</Link>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
