import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import axios from 'axios';

// Type for the data item
interface Item {
  id: string;
  download_url: string;
  author: string;
}

const FeedScreen = () => {
  const [data, setData] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data with optional refresh logic
  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const response = await axios.get(
          `https://picsum.photos/v2/list?page=${isRefresh ? 1 : page}&limit=10`
        );
        setData((prev) =>
          isRefresh ? response.data : [...prev, ...response.data]
        );
        if (isRefresh) setPage(2);
        else setPage((prev) => prev + 1);
        setError(null); // Reset error on successful fetch
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
        if (isRefresh) setIsRefreshing(false);
      }
    },
    [loading, page]
  );

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(true);
  };

  // Render each item in the list
  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.download_url }} style={styles.image} />
      <Text style={styles.author}>{item.author}</Text>
    </View>
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Display error message and retry button
  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
        <Button title="Retry" onPress={handleRefresh} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onEndReached={() => fetchData()}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      ListFooterComponent={
        loading && <ActivityIndicator size="large" color="#0000ff" />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  author: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedScreen;
