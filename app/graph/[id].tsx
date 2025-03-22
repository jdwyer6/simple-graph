import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { getGraphs, saveAllGraphs } from "../../storage/storage";
import { Graph } from "../../types/Graph";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "../../constants/Colors";
import brandStyles from "../../constants/styles";

export default function GraphDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [newValue, setNewValue] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const allGraphs = await getGraphs();
      const found = allGraphs.find((g: Graph) => g.id === id);
      if (found) {
        setGraph(found);
        navigation.setOptions({ title: `${found.emoji} ${found.title}` });
      }
    };
    fetch();
  }, [id]);

  const handleAddPoint = async () => {
    const y = parseFloat(newValue);
    if (isNaN(y)) {
      Alert.alert("Invalid input", "Please enter a numeric value.");
      return;
    }

    const updatedGraph: Graph = {
      ...graph!,
      data: [...(graph?.data ?? []) as [number, number][], [graph?.data?.length ? graph.data.length + 1 : 1, y]],
    };

    const allGraphs = await getGraphs();
    const updatedGraphs = allGraphs.map((g: Graph) =>
      g.id === id ? updatedGraph : g
    );
    await saveAllGraphs(updatedGraphs);
    setGraph(updatedGraph);
    setNewValue("");
  };

  if (!graph) return <Text>Loading...</Text>;

  const xVals = graph.data?.map((point) => point[0]) ?? [];
  const yVals = graph.data?.map((point) => point[1]) ?? [];

  return (
    <View style={styles.container}>
        <View><Entypo name="dots-three-vertical" size={24} color="black" /></View>

      {Array.isArray(graph.data) && graph.data.length > 0 && (
        <LineChart
          data={{
            labels: xVals.map(String),
            datasets: [{ data: yVals }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#f8f8f8",
            backgroundGradientTo: "#f8f8f8",
            color: () => Colors.primary,
            labelColor: () => "#000",
            strokeWidth: 2,
            propsForDots: {
              r: "4",
              strokeWidth: "1",
              stroke: "#4CAF50",
            },
          }}
          style={{ marginVertical: 20, borderRadius: 10 }}
        />
      )}

      <Text style={styles.label}>New Data Point (Y)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Y value"
        value={newValue}
        onChangeText={setNewValue}
        keyboardType="numeric"
      />

      <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleAddPoint}>
        <Text style={brandStyles.primaryButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    backgroundColor: Colors.background.input,
  },
});
