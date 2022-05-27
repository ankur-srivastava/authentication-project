import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import { API_KEY } from '../Auth/AuthForm';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory()
  const enteredPassword = useRef()
  const authCtx = useContext(AuthContext)
  const CHANGE_PASSWORD_API = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`
  
  const submitHandler = (event) => {
    event.preventDefault()
    const password = enteredPassword.current.value
    if(password) {
      fetch(CHANGE_PASSWORD_API, {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password,
          returnSecureToken: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if(!res.ok) {
          console.log('Password reset response not ok')
        }
        console.log('Password reset success')
      }).then(data => {
        console.log('Got data')
        history.replace('/')
      }).catch(e => console.error(e))
    }
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' minLength='7' id='new-password' ref={enteredPassword}/>
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
