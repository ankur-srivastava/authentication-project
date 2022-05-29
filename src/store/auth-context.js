import React, {useState, useEffect} from 'react'

let logoutTimer

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
})

const calculateTokenDuration = (expirationTime) => {
    const curTime = new Date().getTime()
    const expiresIn = new Date(expirationTime).getTime()
    return expiresIn - curTime
}

const validateAndGetToken = () => {
    // check if token expired
    const storedToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expirationTime')

    const remainingTime = calculateTokenDuration(storedExpirationDate)

    // say if we wanted expiration time to be > 1min
    if(remainingTime <= 60000) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null
    }

    return {
        token: storedToken,
        duration: remainingTime
    }
}

export const AuthContextProvider = (props) => {
    const tokenData = validateAndGetToken()
    let initialToken
    if(tokenData && tokenData.token) {
        initialToken = tokenData.token
    }
    const [token, setToken] = useState(initialToken)
    const userLoggedIn = !!token

    const loginHandler = (token, expirationTime) => {
        setToken("abc")
        localStorage.setItem('token', token)
        
        // This time should be calculated using currentDateTime+expiration sent with token
        const tempExpirationTime = new Date(new Date().getTime() + expirationTime)
        localStorage.setItem('expirationTime', tempExpirationTime)
        
        // Not using this fn since I am passing expiration time in ms
        // const tokenDuration = calculateTokenDuration(expirationTime)

        logoutTimer = setTimeout(logoutHandler, expirationTime)
    }
    
    const logoutHandler = () => {
        setToken(null)
        localStorage.removeItem('token')

        if(logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }

    // We want to reset the timer whenever token duration is re-computed, 
    // like when user comes back after an hour
    useEffect(() => {
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.duration)
        }
    }, [tokenData])

    const contextValue = {
        token,
        isLoggedIn: userLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={ contextValue }>
        {props.children}
    </AuthContext.Provider>
}

export default AuthContext
