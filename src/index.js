import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import firebaseConfig from './firebaseConfig';
import 'react-toastify/dist/ReactToastify.css';
import store from './store'
import { Provider } from 'react-redux'
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import ForgotPassword from './pages/ForgotPassword';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/registration",
        element: <Registration />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
