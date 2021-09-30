import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';
import axios from 'axios';
import AuthReducer from './AuthReducer'
import ErrorReducer from './ErrorReducer'

// Transaction state
const initialTransState = {
    transactions: [],
    error: null,
    loading: true
}
export const GlobalContext = createContext(initialTransState);

// Auth state
const initialAuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null
}
export const AuthContext = createContext(initialAuthState);

// Error state
const initialErrorState = {
    msg: {},
    status: null,
    id: null
}
export const ErrorContext = createContext(initialErrorState)


// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialTransState);
    const [errorstate, dispatchError] = useReducer(ErrorReducer, initialErrorState);
    const [authstate, dispatchAuth] = useReducer(AuthReducer, initialAuthState);

    // Transaction actions
    async function getTransactions(userid) {

        try {
            const res = await axios.get('/api/v1/transactions', { params: userid })

            dispatch({
                type: 'GET_TRANSACTIONS',
                payload: res.data.data
            })
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            })
        }
    }

    const deleteTransaction = async (transaction) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authstate.token
            },
            data: {
                id: transaction.id,
                userid: transaction.userid
            }
        }
        try {
            await axios.delete('/api/v1/transactions/delete', config)

            dispatch({
                type: 'DELETE_TRANSACTION',
                payload: transaction.id
            })
        } catch (err) {
            console.log(err)
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            })
        }
    }

    const addTransaction = async (transaction) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authstate.token
            }
        }
        try {
            const res = await axios.post('/api/v1/transactions', transaction, config)

            dispatch({
                type: 'ADD_TRANSACTION',
                payload: res.data.data
            })
        } catch (err) {
            dispatch({
                type: 'TRANSACTION_ERROR',
                payload: err.response.data.error
            })
        }
    }

    // Error actions
    // RETURN ERRORS 
    const returnErrors = (msg, status, id=null) => {
        return {
            type: 'GET_ERRORS',
            payload: { msg, status, id }
        }
    }

    // CLEAR ERRORS
    const clearErrors = () => {
        return {
            type: 'CLEAR_ERRORS'
        }
    }

    // Auth actions
    const registerUser = async ({ name, username, password }) => {
        // Headers
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }

        // Request body
        const body = JSON.stringify({ name, username, password })
        
        try {
            const res = await axios.post('/api/v1/users/register', body, config)
            dispatchAuth({
                type: 'REGISTER_SUCCESS',
                payload: res.data
            })
            window.location.reload();
        } catch (err) {
            dispatchError(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
            dispatchAuth({
                type: 'REGISTER_FAIL'
            })
        }
    }

    // Login user
    const loginUser = async ({ username, password }) => {
        // Headers
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }
        // Request body
        const body = JSON.stringify({ username, password })
        
        try {
            const res = await axios.post('/api/v1/users/login', body, config)
            dispatchError(clearErrors())
            dispatchAuth({
                type: 'LOGIN_SUCCESS',
                payload: res.data
            })
            window.location.reload();
        } catch (err) {
            dispatchError(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
            dispatchAuth({
                type: 'LOGIN_FAIL'
            })
        }
    }

    const logoutUser = () => {
        try {
            dispatchError({
                type: 'CLEAR_ERRORS'
            })
            dispatchAuth({
                type: 'LOGOUT_SUCCESS'
            })
            dispatch({
                type: 'CLEAR_TRANSACTION_STATE'
            })
        } catch (err) {
            dispatchError({
                type: 'CLEAR_ERRORS'
            })
            dispatchAuth({
                type: 'LOGOUT_SUCCESS'
            })
            dispatch({
                type: 'CLEAR_TRANSACTION_STATE'
            })
        }
    }

    // Check and load user
    const loadUser = async () => {
        dispatchAuth({type: 'USER_LOADING'})
        
        // Get token from local storage
        const token = initialAuthState.token

        // Headers
        const config = {
            headers: {
                "Content-type": "application/json"
            }
        }

        // If token, add to headers
        if(token) {
            config.headers['auth-token'] = token
        }
        
        try {
            const res = await axios.get('/api/v1/users/getuser', config)
            dispatchAuth({
                type: 'USER_LOADED',
                payload: res.data
            })
        } catch (err) {
            dispatchError(returnErrors(err.response.data, err.response.status))
            dispatchAuth({
                type: 'AUTH_ERROR'
            })
        }
    }

    return(
        <AuthContext.Provider value={{
            authstate: authstate.isAuthenticated,
            user: authstate.user,
            isLoading: authstate.isLoading,
            token: authstate.token,
            loadUser,
            registerUser,
            logoutUser,
            loginUser,
        }}>
            <ErrorContext.Provider value={{
                error: errorstate,
                returnErrors,
                clearErrors
            }}>
                <GlobalContext.Provider value={{
                    transactions: state.transactions,
                    error: state.error,
                    loading: state.loading,
                    getTransactions,
                    deleteTransaction,
                    addTransaction,
                    }}>
                    {children}
                </GlobalContext.Provider>
            </ErrorContext.Provider>
        </AuthContext.Provider>
    )

} 