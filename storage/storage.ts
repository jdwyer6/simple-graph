import AsyncStorage from "@react-native-async-storage/async-storage";

const saveGraph = async (graph: any) => {
  try {
    const existingData = await AsyncStorage.getItem("graphs");
    const graphs = existingData ? JSON.parse(existingData) : [];
    graphs.push(graph);
    await AsyncStorage.setItem("graphs", JSON.stringify(graphs));
  } catch (error) {
    console.error("Error saving graph:", error);
  }
};

const getGraphs = async () => {
  try {
    const data = await AsyncStorage.getItem("graphs");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error retrieving graphs:", error);
    return [];
  }
};

export { saveGraph, getGraphs }; // ✅ Named exports
