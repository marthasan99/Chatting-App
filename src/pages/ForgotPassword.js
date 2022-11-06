import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const ForgotPassword = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    let [email, setEmail] = useState("")
    let handleForgotPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.success("Recovery email sent")
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
    }
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
            <div className='bg-primary w-full h-screen flex justify-center items-center'>
                <div className='bg-white rounded w-[400px]'>
                    <h3 className='nunito text-primary text-[34.4px] font-bold text-center'>Reset your password</h3>
                    <div className='relative mt-[61.5px] flex justify-center'>
                        <input onChange={(e) => setEmail(e.target.value)} type='email' className='border border-solid border-border-box w-[368px] py-7 px-12 rounded-lg placeholder:nunito placeholder:text-primary placeholder:text-xl placeholder:font-semibold' placeholder='example@email.com' value={email}></input>
                        <p className='nunito text-primary text-sm font-semibold absolute top-[-10px] left-[34px] bg-white px-4'>Email Address</p>
                    </div>
                    <div className='w-[368px] flex justify-between gap-2 mx-auto'>
                        <button onClick={handleForgotPassword} className='bg-button w-[368px] mt-[52px] py-5 nunito text-white text-xl font-semibold rounded-lg mx-auto block'>Update</button>
                        <button className='bg-button w-[368px] mt-[52px] py-5 nunito text-white text-xl font-semibold rounded-lg mx-auto block'><Link to="/login">Back to Login</Link></button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ForgotPassword