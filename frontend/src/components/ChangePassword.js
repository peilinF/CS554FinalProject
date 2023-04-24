import React, {useContext ,useState } from 'react';
import { AuthContext } from '../firebase/Auth';
import { doChangePassword } from '../firebase/FirebaseFunctions';
import '../App.scss';

function ChangePassword() {
  const {currentUser} = useContext(AuthContext);
  const [passwordMatch, setPasswordMatch] = useState('');
  console.log(currentUser);

  const submitForm = async (event) => {
    event.preventDefault();
    const { currentPassword,passwordOne, passwordTwo } = event.target.elements;

    if (passwordOne.value !== passwordTwo.value) {
      setPasswordMatch('New Passwords do not match');
      return;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        passwordOne.value
        );
      alert('Password Changed Successfully');
    } catch (error) {
      alert(error);
    }
  };

  if(currentUser.providerData[0].providerId === 'password') {
    return (
      <div className="change-password">
       {passwordMatch && <h4 className='error'>{passwordMatch}</h4>}
        <h1>Change Password</h1>
        <form onSubmit={submitForm}>
          <div><label htmlFor="currentPassword">Current Password</label>
          <input name="currentPassword" id = 'currentPassword' type="password" placeholder="Current Password" autoComplete='off' required/></div>
          <div><label htmlFor="passwordOne">New Password</label>
          <input name="passwordOne" id = 'passwordOne' type="password" placeholder="New Password" autoComplete='off' required/></div>
          <div><label htmlFor="passwordTwo">Confirm New Password</label>
          <input name="passwordTwo" id = 'passwordTwo' type="password" placeholder="Confirm New Password" autoComplete='off' required/></div>
          <button type="submit">Change Password</button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="change-password">
        <h1>Change Password</h1>
        <p>You can only change your password if you signed up with email and password, not with Social Media</p>
      </div>
    );
  }
}

export default ChangePassword;