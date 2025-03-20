import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { saveGraph } from "../../storage/storage";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import * as Crypto from "expo-crypto";

export default function CreateGraphScreen() {
  const router = useRouter();
  const newId = Crypto.randomUUID();

  // Form state
  const [title, setTitle] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [emoji, setEmoji] = useState("📊");

  // Function to save graph data
  const handleSaveGraph = async () => {
    if (!title || !xAxis || !yAxis) {
      Alert.alert("Error", "All fields must be filled out!");
      return;
    }

    const newGraph = {
      id: newId,
      title,
      xAxis,
      yAxis,
      emoji,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveGraph(newGraph);

      Alert.alert("Success", "Graph saved!");
      router.back();
    } catch (error) {
      console.error("Error saving graph:", error);
      Alert.alert("Error", "Could not save graph.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create a New Graph</Text>

      <TextInput
        style={styles.input}
        placeholder="Graph Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="X-Axis Label"
        value={xAxis}
        onChangeText={setXAxis}
      />
      <TextInput
        style={styles.input}
        placeholder="Y-Axis Label"
        value={yAxis}
        onChangeText={setYAxis}
      />

      <Text style={styles.emojiLabel}>Select an Emoji:</Text>
      {/* <EmojiSelector
        category={Categories.symbols}
        onEmojiSelected={emoji => console.log(emoji)}
        />; */}

      <Button title="Create Graph" onPress={handleSaveGraph} color="#4CAF50" />
      <Button title="Cancel" onPress={() => router.back()} color="#FF5252" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  emojiLabel: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
  },
  emojiPicker: {
    alignSelf: "center",
    marginBottom: 20,
  },
});
