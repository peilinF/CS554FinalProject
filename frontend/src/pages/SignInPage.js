import React from "react";
import MainLayout from "../layouts/MainLayout";
import "./styles.scss";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

const SignInPage = () => {
  const [nameData, setNameData] = useState('');
  const [passwordData, setPasswordData] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const postData = { "username": nameData, "password": passwordData };
    console.log(postData)
    fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          console.log("Success");
          navigate('/');
        } else {
          setError(data.message);
        }
      });
  }

  const handleNameChange = (event) => {
    setNameData(event.target.value);
  }
  const handlePasswordChange = (event) => {
    setPasswordData(event.target.value);
  }
  return (
    <MainLayout>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" placeholder="Email" value={nameData} onChange={handleNameChange} />
        </label>
        <label>
          Password:
          <input type="text" placeholder="Password" value={passwordData} onChange={handlePasswordChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </MainLayout>
  );
};

export default SignInPage;
