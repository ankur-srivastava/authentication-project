import { useState, useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

// APIs https://firebase.google.com/docs/reference/rest/auth
// https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

export const API_KEY = 'AIzaSyCF7DX6ksPny95P_8Xp2an5_GUdgHcXHwI'

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false)
  const emailInputRef = useRef()
  const passwordInputRef = useRef()
  const history = useHistory()

  const authCtx = useContext(AuthContext)

  const SIGNUP_API = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  const LOGIN_API = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault()
    setIsLoading(true)
    // get input values
    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    // validate
    // submit
    let url = ''
    if(isLogin) {
      url = `${LOGIN_API}${API_KEY}`
    } else {
      url = `${SIGNUP_API}${API_KEY}`
    }
    // Send Request
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      setIsLoading(false)
      if(res.ok) {
        return res.json()
      } else {
        return res.json().then(data => {
          // Firebase returns an object with error key
          let errorMessage = 'Authentication Failed'
          if(data && data.error && data.error.message) {
            errorMessage = data.error.message
          }            
          throw new Error(errorMessage)
        })
      }
    }).then(data => {
      const expiresInMs = +data.expiresIn*1000
      // authCtx.login(data.idToken, expiresInMs)
      // for testing
      authCtx.login(data.idToken, 60000)
      history.replace('/')
    }).catch(e => {
      alert(e.message)
    })
    // Ends
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailInputRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' ref={passwordInputRef} id='password' required />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Loading ...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
