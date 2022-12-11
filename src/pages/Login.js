import React, { useState } from 'react'
import { RiEyeCloseFill, RiEyeFill } from 'react-icons/ri'
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { ToastContainer, toast } from 'react-toastify';
import { Circles } from 'react-loader-spinner'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLoginInfo } from '../slices/userSlice'

const Login = () => {
    const auth = getAuth();
    const db = getDatabase();
    const provider = new GoogleAuthProvider();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [passwordShow, setPasswordShow] = useState(false);
    let [emailErr, setEmailErr] = useState('');
    let [passwordErr, setPasswordErr] = useState('');
    let [success, setSuccess] = useState('');
    let [loading, setLoading] = useState(false);


    let handleEmail = (e) => {
        setEmail(e.target.value);
        setEmailErr("");
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
            if (email && password && re0.test(email) && re.test(password) && re2.test(password) && re3.test(password) && re4.test(password) && re5.test(password)) {
                setLoading(true);
                signInWithEmailAndPassword(auth, email, password)
                    .then((user) => {
                        setLoading(false);
                        toast.success("Login Successful");
                        dispatch(userLoginInfo(user.user));
                        localStorage.setItem("userInfo", JSON.stringify(user.user));
                        setTimeout(() => {
                            navigate("/")
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
    }
    let handleGoogleSignIn = () => {
        signInWithPopup(auth, provider).then((user) => {
            set(ref(db, 'users/' + user.user.uid), {
                username: user.user.displayName,
                email: user.user.email,
            });
            toast.success("Login Successful");
            dispatch(userLoginInfo(user.user));
            localStorage.setItem("userInfo", JSON.stringify(user.user));
            setTimeout(() => {
                navigate("/")
            }, 5000);
        })
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
            <div className='flex'>
                <div className='w-[52.5%] flex justify-end items-center'>
                    <div className='mr-[69px]'>
                        <h3 className='nunito text-primary text-[34.4px] font-bold'>Login to your account!</h3>
                        <button onClick={handleGoogleSignIn} className='mt-5 border border-solid border-border-box flex px-8 py-5 w-56 cursor-pointer'>
                            <picture className='mr-2.5'>
                                <img src='images/google.png' alt='Google' />
                            </picture>
                            <p className='sans text-account text-sm font-semibold'>Login with google</p>
                        </button>
                        <div className='relative mt-[61.5px]'>
                            <input onChange={handleEmail} type='email' className='border-b border-solid border-border-box w-[368px] py-7 placeholder:nunito placeholder:text-primary placeholder:text-xl placeholder:font-semibold outline-none' placeholder='example@email.com' value={email}></input>
                            <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-0 bg-white'>Email Address</p>
                            {emailErr && <p className='nunito text-red-500 text-sm font-semibold'>{emailErr}</p>}
                        </div>
                        <div className='relative mt-14 w-[368px]'>
                            <input onChange={handlePassword} type={passwordShow ? "text" : "password"} className='border-b border-solid border-border-box w-[368px] py-7 relative placeholder:nunito placeholder:text-primary placeholder:text-xl placeholder:font-semibold outline-none' placeholder='******' value={password}></input>
                            <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-0 bg-white'>Password</p>
                            {
                                passwordShow ? <RiEyeCloseFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[43%] right-6' /> : <RiEyeFill onClick={() => setPasswordShow(!passwordShow)} className='absolute top-[35%] right-6' />
                            }
                            {passwordErr && <p className='nunito text-red-500 text-sm font-semibold'>{passwordErr}</p>}

                        </div>
                        {loading ?
                            <button onClick={handleSubmit} className='bg-button w-[368px] mt-[52px] py-5 nunito text-white text-xl font-semibold rounded-lg flex justify-center'>
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
                            <button onClick={handleSubmit} className='bg-button w-[368px] mt-[52px] py-5 nunito text-white text-xl font-semibold rounded-lg'>Login to Continue</button>}


                        <p className='sans text-account text-sm font-normal w-[368px] text-left mt-9'>Don’t have an account ?<Link to="/registration" className='text-sign-up font-bold'>Sign Up</Link></p>
                        <p className='sans text-account text-sm font-normal w-[368px] text-center mt-9'><Link to="/forgot-password" className='text-sign-up font-bold'>Forgot Password?</Link></p>
                    </div>

                </div>
                <div className='w-[47.5%] h-screen'>
                    <picture>
                        <img src='images/login.png' alt='' className='h-screen w-full object-cover' />
                    </picture>
                </div>
            </div>
        </>
    )
}

export default Login