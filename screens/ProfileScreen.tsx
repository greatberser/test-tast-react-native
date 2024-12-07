import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Define the User type
interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('https://reqres.in/api/users/1');
      setUser(response.data.data);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      setError('Failed to fetch user data'); // Handle error
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  // Handle logout and navigation
  const handleLogout = () => {
    navigation.replace('Login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Show loading spinner or error message
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={fetchUser} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user && (
        <>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text>
            {user.first_name} {user.last_name}
          </Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default ProfileScreen;
