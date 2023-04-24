import React, {useContext,useState} from 'react';
import { AuthContext } from '../firebase/Auth';
import { Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword} from '../firebase/FirebaseFunctions';
import SocialSignIn from './SocialSignIn';

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [passwordMatch, setPasswordMatch] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    const {displayName, email, passwordOne, passwordTwo} = event.target.elements;
    if(passwordOne.value !== passwordTwo.value){
      setPasswordMatch('Passwords do not match');
      return false;
    } 

    try {
      await doCreateUserWithEmailAndPassword(
        email.value, 
        passwordOne.value, 
        displayName.value);
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <div className="sign-up">
      <h1>Sign Up</h1>
      {passwordMatch && <h4 className='error'>{passwordMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input type="text" name="displayName" placeholder="Display Name"  required/>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" placeholder="Email"  required/>
        </div>
        <div className='form-group'>
          <label htmlFor="passwordOne">Password</label>
          <input type="password" name="passwordOne" placeholder="Password" autoComplete='off' required/>
        </div>
        <div className='form-group'>
          <label htmlFor="passwordTwo">Confirm Password</label>
          <input type="password" name="passwordTwo" placeholder="Confirm Password" autoComplete='off' required/>
        </div>
        <button id='submitButton' name='submitButton' type="submit">Sign Up</button>
      </form>
      <br/>
      <SocialSignIn />
    </div>
  );
}

export default SignUp;

