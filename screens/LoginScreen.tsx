import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      if (authToken) {
        navigation.replace('AppTabs');
      }
    };
    checkAuth();
  }, [navigation]);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    setLoading(true);

    try {
      const storedUser = await AsyncStorage.getItem(email);

      if (storedUser) {
        // Логін
        const { password: storedPassword } = JSON.parse(storedUser);
        if (password === storedPassword) {
          await AsyncStorage.setItem('authToken', 'sampleAuthToken');
          setEmail('');
          setPassword('');
          navigation.replace('AppTabs');
        } else {
          setError('Invalid password.');
        }
      } else {
        // Реєстрація
        await AsyncStorage.setItem(email, JSON.stringify({ email, password }));
        await AsyncStorage.setItem('authToken', 'sampleAuthToken');
        setEmail('');
        setPassword('');
        navigation.replace('AppTabs');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <ImageBackground
      source={require('../assets/images/photo_bg.png')}
      style={styles.background}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login or Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError('');
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.buttonWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#ff6c00" />
          ) : (
            <Button
              title="Login / Register"
              color="#ff6c00"
              onPress={handleAuth}
            />
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: -1,
    paddingTop: 263,
  },
  formContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingBottom: 25,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 16,
    paddingLeft: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  buttonWrapper: {
    width: '85%',
    borderRadius: 100,
    overflow: 'hidden',
    marginTop: 43,
  },
});

export default LoginScreen;
