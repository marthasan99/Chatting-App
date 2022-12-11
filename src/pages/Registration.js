import React, { useState } from 'react'
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import { Circles } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from "firebase/database";
// import { userLoginInfo } from '../slices/userSlice';

const Registration = () => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate();
  let [email, setEmail] = useState('');
  let [fullName, setFullName] = useState('');
  let [password, setPassword] = useState('');
  let [passwordShow, setPasswordShow] = useState(false);

  let [emailErr, setEmailErr] = useState('');
  let [fullNameErr, setFullNameErr] = useState('');
  let [passwordErr, setPasswordErr] = useState('');
  let [success, setSuccess] = useState('');
  let [loading, setLoading] = useState(false);


  let handleEmail = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  }
  let handleFullName = (e) => {
    setFullName(e.target.value);
    setFullNameErr("");
  }
  let handlePassword = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  }
  let handleSubmit = () => {
    const re0 =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    const re = /^(?=.*[a-z])/;
    const re2 = /^(?=.*[A-Z])/;
    const re3 = /^(?=.*[0-9])/;
    const re4 = /^(?=.*[!@#$%^&*])/;
    const re5 = /^(?=.{8,})/;

    if (!email) {
      setEmailErr("Email is required")
    } else {
      if (!re0.test(email)) {
        setEmailErr("Please enter a valid email")
      }
    }
    if (!fullName) {
      setFullNameErr("Full Name is required")
    }
    if (!password) {
      setPasswordErr("Password is required")
    } else {
      if (!re.test(password)) {
        setPasswordErr("Password must contain at least 1 lowercase alphabetical character")
      }
      if (!re2.test(password)) {
        setPasswordErr("Password must contain at least 1 uppercase alphabetical character")
      }
      if (!re3.test(password)) {
        setPasswordErr("Password must contain at least 1 numeric character")
      }
      if (!re4.test(password)) {
        setPasswordErr("Password must contain at least one special character")
      }
      if (!re5.test(password)) {
        setPasswordErr("Password must be eight characters or longer")
      }
      if (email && fullName && password && re0.test(email) && re.test(password) && re2.test(password) && re3.test(password) && re4.test(password) && re5.test(password)) {
        setLoading(true);
        createUserWithEmailAndPassword(auth, email, password)
          .then((user) => {
            updateProfile(auth.currentUser, {
              displayName: fullName, photoURL: "images/demo-profile.jpg"
            }).then(() => {
              toast.success("Registration Successful. Please verify your email");
              setEmail("");
              setFullName("");
              setPassword("");
              sendEmailVerification(auth.currentUser)
              setLoading(false);

              setTimeout(() => {
                navigate("/login");
              }, 4000);
            }).catch((error) => {
              console.log(error);
            }).then(() => {
              set(ref(db, 'users/' + user.user.uid), {
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
  }


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
      <div className='max-w-[90%] mx-auto md:max-w-full  md:flex'>
        <div className='md:w-[52.5%] flex justify-end items-center'>
          <div className=' px-0 md:px-2 lg:px-0  lg:mr-[69px] w-full md:w-auto'>
            <h3 className='nunito text-primary text-2xl lg:text-[34.4px] font-bold text-center md:text-left'>Get started with easily register</h3>
            <p className='nunito text-input-box text-base md:text-xl font-normal mt-3 mb-15 text-center md:text-left'>Free register and you can enjoy it</p>
            <div className='relative mt-[61.5px]'>
              <input onChange={handleEmail} type='email' className='border border-solid border-border-box w-full md:w-[368px] py-7 px-12 rounded-lg placeholder:nunito placeholder:text-primary placeholder:text-base placeholder:md:text-xl placeholder:font-semibold' placeholder='example@email.com' value={email}></input>
              <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-[34px] bg-white px-4'>Email Address</p>
              {emailErr && <p className='nunito text-red-500 text-sm font-semibold'>{emailErr}</p>}

            </div>
            <div className='relative mt-14'>
              <input onChange={handleFullName} type='text' className='border border-solid border-border-box w-full md:w-[368px] py-7 px-12 rounded-lg placeholder:nunito placeholder:text-primary placeholder:text-base placeholder:md:text-xl placeholder:font-semibold' placeholder='Full name here' value={fullName}></input>
              <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-[34px] bg-white px-4'>Full Name</p>
              {fullNameErr && <p className='nunito text-red-500 text-sm font-semibold'>{fullNameErr}</p>}

            </div>
            <div className='relative mt-14 w-full md:w-[368px]'>
              <input onChange={handlePassword} type={passwordShow ? "text" : "password"} className='border border-solid border-border-box w-full md:w-[368px] py-7 px-12 rounded-lg relative placeholder:nunito placeholder:text-primary placeholder:text-base placeholder:md:text-xl placeholder:font-semibold' placeholder='******' value={password}></input>
              <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-[34px] bg-white px-4'>Password</p>
              {
                passwordShow ? <RiEyeCloseFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[43%] right-6' /> : <RiEyeFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[35%] right-6' />
              }
              {passwordErr && <p className='nunito text-red-500 text-sm font-semibold'>{passwordErr}</p>}

            </div>
            {loading ?
              <button onClick={handleSubmit} className='bg-button w-full md:w-[368px] mt-[52px] py-5 nunito text-white text-xl font-semibold rounded-[86px] flex justify-center'>
                <Circles
                  height="28"
                  width="28"
                  color="#fff"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              </button> :
              <button onClick={handleSubmit} className='bg-button w-full md:w-[368px] mt-[52px] py-5 nunito text-white text-base md:text-xl font-semibold rounded-[86px]'>Sign Up</button>}


            <p className='sans text-account text-sm font-normal w-full md:w-[368px] text-center mt-9'>Already  have an account ? <Link to="/login" className='text-sign-up font-bold'>Sign In</Link></p>
          </div>

        </div>
        <div className='hidden md:block md:w-[47.5%] md:h-screen'>
          <picture>
            <img src='images/registration.png' alt='' className='h-screen w-full object-cover' />
          </picture>
        </div>
      </div>
    </>

  )
}

export default Registration