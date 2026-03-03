import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

// always send cookies with requests
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // during development we proxy /api to the backend so we can use relative URLs
    // in production you can set VITE_BACKEND_URL and prepend it if needed.
    // use proxy during development so backendUrl can be omitted
    const backendUrl = import.meta.env.DEV
        ? ''
        : import.meta.env.VITE_BACKEND_URL || '';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (err) {
            toast.error(err.message);
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (err) {
            toast.error(err.message);
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}