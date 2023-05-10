import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../firebase/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disabledRegister, setDisabledRegister] = useState(true);

  useEffect(() => {
    if (validateEmail(email) && password.length >= 6 ) {
      setDisabledRegister(false);
    } else {
      setDisabledRegister(true);
    }
    
  }, [password,email]);

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$/gm;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {


    const auth = getAuth(app);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      navigation.navigate('Map');
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
      
    }
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
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
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={disabledRegister}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {email && !validateEmail(email) && (<Text style={styles.validInput}>Please enter a valid email address</Text>)}
      {password && ! validatePassword(password) && (<Text style={styles.validInput}>Password must contains 1 uppercase, 1lowercase, 1 special characters, 1 number at least 6 characters long</Text>)}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
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
  registerText: {
    marginTop: 20,
    color: '#007AFF',
  },
  validInput: {
    color: 'red',
  },

});
