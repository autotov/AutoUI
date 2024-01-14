import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';

export default function () {

    const { setCompanyValue, setIsLogin } = useStateContext();
    const [respStatus, setRespStatus] = useState(0);
    const postLogout = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        const resp = await fetch('/signout', requestOptions);
        const status = await resp.status;
    }

    sessionStorage.setItem("userData", "{}");
    setCompanyValue("");

    postLogout();
    setIsLogin(false);

    const navigate = useNavigate();
    useEffect(() => {
       navigate("/login");
    }, []);

    return (
        <div className="Auth-form-container">
            Logout
        </div>
    );
}