import React from 'react';
import SignOutButton from './SignOut';
import ChangePassword from './ChangePassword';

function Account() {
  return (
    <div>
      <h1>Account</h1>
      <SignOutButton />
      <ChangePassword />
    </div>
  );
}

export default Account;