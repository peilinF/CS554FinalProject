import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app from "../firebase/firebaseConfig";
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disabledRegister, setDisabledRegister] = useState(true);

  const validateEmail = (email) => {
    // Use a simple regex to validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };



  useEffect(() => {
    if (validateEmail(email) && password.length >= 6 && password === confirmPassword) {
      setDisabledRegister(false);
    } else {
      setDisabledRegister(true);
    }
    
  }, [password, confirmPassword,email]);



  const handleRegister = async () => {
    

    const auth = getAuth(app);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigate to the main screen after successful registration
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
      {email && !validateEmail(email) && (<Text style={styles.validPassword}>Please enter a valid email address</Text>)}
      {password && password.length < 6 && (<Text style={styles.validPassword}>Password must be at least 6 characters long</Text>)}
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
