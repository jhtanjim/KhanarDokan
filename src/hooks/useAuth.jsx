// useAuth.js - Hook to get current user
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const useAuth = () => {
    const auth = useContext(AuthContext);
    return auth;
};

export default useAuth;

