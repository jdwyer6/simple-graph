import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { getGraphs } from "../../storage/storage"; 
import { useState, useEffect } from "react";

type Graph = {
  id: string;
  title: string;
  emoji: string;
  xAxis: string;
  yAxis: string;
};

export default function ExploreScreen() {
  const router = useRouter();
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const screenWidth = Dimensions.get("window").width;
  const numColumns = 2;
  const gap = 10;
  const padding = 10 * 2; 
  const cardWidth = (screenWidth - padding - (gap * (numColumns - 1))) / numColumns;

  useEffect(() => {
    const fetchGraphs = async () => {
      const savedGraphs = await getGraphs();
      setGraphs(savedGraphs);
    };

    fetchGraphs();
    console.log(graphs);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        <TouchableOpacity 
            style={[styles.card, { width: cardWidth }]} 
            onPress={() => router.push("./create")}
          >
            <Text style={styles.cardText}>Create</Text>
        </TouchableOpacity>
        <FlatList
        data={graphs}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { width: cardWidth }]} onPress={() => console.log("Graph Clicked:", item)}>
            <Text style={[styles.emoji, { fontSize: cardWidth * .5 }]}>{item.emoji}</Text>
            <Text style={styles.cardText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10, // Controls left and right padding
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between", // Ensures even spacing between items
  },
  card: {
    aspectRatio: 1, // Ensures perfect squares
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Space between rows
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2, // iOS shadow
  },
  emoji: {
    // fontSize: screenWidth * 0.2,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
