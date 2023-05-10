import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import app from "../firebase/firebaseConfig";
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabledRegister, setDisabledRegister] = useState(true);
  const [userName, setUserName] = useState('');
  const validateEmail = (email) => {
   
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    return passwordRegex.test(password);
  };


  useEffect(() => {
    if (validateEmail(email) && validatePassword(password) && password === confirmPassword && userName.length >= 3 ) {
      setDisabledRegister(false);
    } else {
      setDisabledRegister(true);
    }
    
  }, [password, confirmPassword,email]);




  const handleRegister = async () => {
    

    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        await updateProfile(auth.currentUser, { displayName: userName});
    });

    await axios.post('http://192.168.194.157:4000/users/register', {
          name: userName,
          email: email,
          uid: auth.currentUser.uid
        }).catch((error) => {
        console.log(error);
      });

      setUserName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigation.navigate('Map');
      console.log('User registered successfully');
    } catch (error) {
      Alert.alert('Error', e);
      
    }
    console.log('Registering...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="User Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={disabledRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
      {userName && userName.length < 3 && (<Text style={styles.validPassword}>User name must be at least 3 characters long</Text>)}
      {email && !validateEmail(email) && (<Text style={styles.validPassword}>Please enter a valid email address</Text>)}
      {password &&!validatePassword(password) && (<Text style={styles.validPassword}>Password must has 1 uppercase,1 lowercase, 1 special character, 1 number at least 6 characters</Text>)}
      {password && password.length >= 6 && confirmPassword && password !== confirmPassword && (<Text style={styles.validPassword}>Passwords do not match</Text>)}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginText: {
    marginTop: 20,
    color: '#007AFF',
  },
  validPassword: {
    color: 'red',
  },
});
