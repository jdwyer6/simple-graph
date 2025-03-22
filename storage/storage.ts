import AsyncStorage from "@react-native-async-storage/async-storage";
import { Graph } from "../types/Graph"

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

const deleteGraph = async (idToDelete: string) => {

  try {
    const data = await AsyncStorage.getItem("graphs");
    const graphs = data ? JSON.parse(data) : [];

    const updatedGraphs = graphs.filter((g: Graph) => g.id !== idToDelete);
    await AsyncStorage.setItem("graphs", JSON.stringify(updatedGraphs));

    return updatedGraphs;
  } catch (error) {
    console.error("Failed to delete graph:", error);
    return [];
  }
};
 
const saveAllGraphs = async (graphs: Graph[]) => {
  try {
    await AsyncStorage.setItem("graphs", JSON.stringify(graphs));
  } catch (err) {
    console.error("Failed to save all graphs:", err);
  }
};


export { saveGraph, getGraphs, deleteGraph, saveAllGraphs };
