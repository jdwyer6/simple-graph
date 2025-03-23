import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { getGraphs, deleteGraph } from "../../storage/storage"; 
import { useState, useEffect, useCallback } from "react";
import Entypo from '@expo/vector-icons/Entypo';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Graph } from "../../types/Graph"

export default function ExploreScreen() {
  const router = useRouter();
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [colorOptions] = useState(Object.entries(Colors.cardColors).map(([name, hex]) => ({ name, hex })));

  useFocusEffect(
    useCallback(() => {
      const fetchGraphs = async () => {
        const savedGraphs = await getGraphs();
        setGraphs(savedGraphs);
      };
  
      fetchGraphs();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Simple Graph</Text>
        <View style={styles.grid}>
          <FlatList
            data={graphs}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.card, {backgroundColor: colorOptions[item.colorIdx].hex}]} onPress={() => router.push(`../graph/${item.id}`)}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.cardText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#ccc",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    borderRadius: 10,
    marginBottom: 10,
  },
  emoji: {
    fontSize: 80,
  },
  cardText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  dots: {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.5,
  }
});
