import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Graph } from "@/types/Graph";
import brandStyles from "@/constants/styles";
import { getGraphs, saveAllGraphs } from "@/storage/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";

export default function EditDataScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter()
  const [graph, setGraph] = useState<Graph | null>(null);
  const [editedData, setEditedData] = useState<[number, number][]>([]);


  useEffect(() => {
    const fetch = async () => {
      const graphId = Array.isArray(id) ? id[0] : id;
      const allGraphs = await getGraphs();
      const found = allGraphs.find((g: Graph) => g.id === graphId);
      if (found) setGraph(found);
      else console.warn("Graph not found for ID:", graphId);
    };
    fetch();
  }, [id]);
  
  useEffect(() => {
    if (graph?.data) {
      setEditedData([...graph.data]);
    }
  }, [graph]);
  

  const updatePoint = (index: number, newY: number) => {
    console.log('updatepoint')
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
      <TouchableOpacity
        style={brandStyles.buttonPrimary}
        onPress={async () => {
          if (!graph) return;

          const updatedGraph = { ...graph, data: editedData };
          setGraph(updatedGraph);

          const graphId = Array.isArray(id) ? id[0] : id;
          const all = await getGraphs();
          const updatedGraphs = all.map((g: Graph) =>
            g.id === graphId ? updatedGraph : g
          );
          await saveAllGraphs(updatedGraphs);
          router.back();
        }}
      >
        <Text style={brandStyles.primaryButtonText}>Save</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Entries</Text>
      <FlatList
        data={editedData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.label}>X: {item[0]}</Text>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              value={item[1].toString()}
              onChangeText={(text) => {
                const newData = [...editedData];
                newData[index][1] = Number(text);
                setEditedData(newData);
              }}
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
