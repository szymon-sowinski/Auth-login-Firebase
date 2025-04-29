import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import auth from './firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        setError('');
        setIsLoggedIn(true);
        setUserEmail(user.email);
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        console.error(err);
        setError('Nieprawidłowy email lub hasło.');
      });
  };

  const handleRegister = () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        setError('');
        setIsLoggedIn(true);
        setUserEmail(user.email);
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        console.error("Rejestracja nie powiodła się: ", err.message);
        setError(`Rejestracja nie powiodła się: ${err.message}`);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        setUserEmail('');
        setEmail('');
        setPassword('');
      })
      .catch((err) => {
        console.error('Błąd wylogowania: ', err.message);
      });
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text>Witaj, {userEmail}!</Text>
          <Button title="Wyloguj się" onPress={handleLogout} />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Hasło"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {isRegistering ? (
            <>
              <Button title="Zarejestruj się" onPress={handleRegister} />
              <Text style={styles.toggleText}>
                Masz już konto?{' '}
                <Text style={styles.linkText} onPress={toggleMode}>
                  Zaloguj się
                </Text>
              </Text>
            </>
          ) : (
            <>
              <Button title="Zaloguj się" onPress={handleLogin} />
              <Text style={styles.toggleText}>
                Nie masz konta?{' '}
                <Text style={styles.linkText} onPress={toggleMode}>
                  Zarejestruj się
                </Text>
              </Text>
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  toggleText: {
    marginTop: 20,
    textAlign: 'center',
  },
  linkText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
