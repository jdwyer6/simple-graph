import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { Graph } from "@/types/Graph";
import { getGraphs, saveAllGraphs } from "@/storage/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function EditDataScreen() {
  const { id } = useLocalSearchParams();
  const [graph, setGraph] = useState<Graph | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const allGraphs = await getGraphs();
      const found = allGraphs.find((g:Graph) => g.id === id);
      if (found) setGraph(found);
    };
    fetch();
  }, [id]);

  const updatePoint = (index: number, newY: number) => {
    if (!graph) return;
    const updated = [...graph.data ?? []];
    updated[index][1] = newY;
    const newGraph = { ...graph, data: updated };

    setGraph(newGraph);
    getGraphs().then((all) => {
      const updatedGraphs = all.map((g:Graph) => (g.id === id ? newGraph : g));
      saveAllGraphs(updatedGraphs);
    });
  };

  if (!graph) return <Text>Loading...</Text>;

  return (
    <SafeAreaView style={[styles.container, { flex: 1 }]}>
      <Text style={styles.title}>{graph.title} - Edit Entries</Text>
      <FlatList
        data={graph.data}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.label}>X: {item[0]}</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              defaultValue={item[1].toString()}
              onEndEditing={(e) => updatePoint(index, Number(e.nativeEvent.text))}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 8,
    backgroundColor: Colors.background.input,
  },
});
