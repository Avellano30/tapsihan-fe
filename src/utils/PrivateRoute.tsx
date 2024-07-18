import { useState, useEffect } from 'react';
import { Outlet, Navigate, useParams } from 'react-router-dom';
import Layout from '../layout/Layout';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export default function PrivateRoutes() {
    const [authorized, setAuthorized] = useState(true);
    const sessionToken = localStorage.getItem('session');
    const index = localStorage.getItem('index');
    const currentDate = Date.now()/1000;
    const paramChange = useParams();

    useEffect(() => {
        if (sessionToken && sessionToken !== null) {
            try {
                const decoded = jwtDecode<JwtPayload>(sessionToken);
                
                if (decoded.exp && decoded.exp > currentDate) {
                    setAuthorized(true);
                } else {
                    console.error('Token expired');
                    setAuthorized(false);
                    localStorage.removeItem('session');
                    localStorage.removeItem('index');
                }
            } catch (error) {
                console.error('Invalid token:', error);
                setAuthorized(false);
                localStorage.removeItem('session');
                localStorage.removeItem('index');
            }
        } else {
            console.log('Invalid token');
            setAuthorized(false);
            localStorage.removeItem('session');
            localStorage.removeItem('index');
        }
    }, [sessionToken, index, paramChange, currentDate]);

    return authorized ? (
        <Layout>
            <Outlet />
        </Layout>
    ) : (
        <Navigate to="/" />
    );
}
