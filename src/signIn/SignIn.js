import './SignIn.css'
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext"
import { useState, useRef } from 'react';
import { auth } from '../firebase';
import { useHistory } from 'react-router-dom';

export default function SignIn() {
  const history = useHistory();

  const [name, setName] = useState("")
  const [password, setPass] = useState("");
  const { login, currentUser } = useAuth();
  const emailRef = useRef()
  const passwordRef = useRef()

  async function signIn(event) {
    event.preventDefault();
    try {
      await login(emailRef.current.value, passwordRef.current.value);
      await history.push('/');
    } catch(error) {
      document.getElementById('error').style.display = "block";
    }
    console.log(auth.currentUser);
  }

    return (
      <div>
        <div className ="login-page">
          <div className ="form">
            <p className = "title"> Sign In </p>
            <form className="login-form" id = "frm1">
              <input type="text" ref={emailRef} className = "five" placeholder="Email" autoComplete = "off" required/>
              <label className = "six">Email</label>
              <input type="password" ref={passwordRef} placeholder="Password" autoComplete = "off" required/>
              <label className = "two">Password</label>
              <p id = "error" className = "error">Account information was entered incorrectly.</p>
              <button onClick = {signIn}>login</button>
              <p className ="message">Not registered? <Link to="/SignUp">Create an account</Link></p>
            </form>
          </div>
        </div>
      </div>
    )
}
