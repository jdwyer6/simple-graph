import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import brandStyles from "../../constants/styles";
import { saveGraph } from "../../storage/storage";
import { useRouter } from "expo-router";
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard'
import * as Crypto from "expo-crypto";
import { Colors } from "../../constants/Colors";
import ColorSelector from "../../components/ColorSelector";

export default function CreateGraphScreen() {
  const router = useRouter();
  const newId = Crypto.randomUUID();
  const [emojiBoxOpen, setEmojiBoxOpen] = useState(false);
  const [colorOptions] = useState(Object.entries(Colors.pastels).map(([name, hex]) => ({ name, hex })));
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [emoji, setEmoji] = useState("📊");
  const [colorIdx, setColorIdx] = useState(0);

  useEffect(() => {
    const randomColorIdx = Math.floor(Math.random() * colorOptions.length);
    setColorIdx(randomColorIdx);
  }, []);
      
  
  const handleSelectEmoji = (emoji: EmojiType) => {
    console.log("Selected emoji:", emoji);
    setEmoji(emoji.emoji);
  }

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
      colorIdx,
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

        <Text style={styles.label}>Graph Title</Text>
        <TextInput
            style={styles.input}
            placeholder="Graph Title"
            value={title}
            onChangeText={setTitle}
        />

        <Text style={styles.label}>X (Horizontal) Axis Label</Text>
        <TextInput
            style={styles.input}
            placeholder="X-Axis Label"
            value={xAxis}
            onChangeText={setXAxis}
        />

        <Text style={styles.label}>Y (Vertical) Axis Label</Text>
        <TextInput
            style={styles.input}
            placeholder="Y-Axis Label"
            value={yAxis}
            onChangeText={setYAxis}
        />

        <Text style={styles.label}>Emoji</Text>
        <TouchableOpacity onPress={() => setEmojiBoxOpen(true)} style={brandStyles.buttonTertiary}>
          <View style={brandStyles.flexRowCenter}>
            <Text>{emoji}</Text> 
            <Text>Select an Emoji</Text> 
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Color</Text>
        <TouchableOpacity onPress={() => setColorModalOpen(true)} style={brandStyles.buttonTertiary}>
          <View style={brandStyles.flexRowCenter}>
            <View style={[styles.colorSelection, {backgroundColor: colorOptions[colorIdx].hex}]}></View>
            <Text>Select an Color</Text> 
          </View>
        </TouchableOpacity>

        <EmojiPicker onEmojiSelected={handleSelectEmoji} enableSearchBar open={emojiBoxOpen} onClose={() => setEmojiBoxOpen(false)} />
        <ColorSelector visible={colorModalOpen} onClose={() => setColorModalOpen(false)} colorOptions={colorOptions} currentIdx={colorIdx} onSelect={(idx) => setColorIdx(idx)} />

        <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleSaveGraph}>
            <Text style={brandStyles.primaryButtonText}>Create Graph</Text>
        </TouchableOpacity>

        <TouchableOpacity style={brandStyles.buttonSecondary} onPress={() => router.back()}>
            <Text style={brandStyles.secondaryButtonText}>Cancel</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
    color: Colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border.light,
    padding: 10,
    marginBottom: 10,
    borderRadius: 100,
    color: Colors.text,
    backgroundColor: Colors.background.input,
    fontSize: 12,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  additionalConfigContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  colorSelection: {
    width: 20,
    height: 20,
    borderRadius: 100,
  }
});
