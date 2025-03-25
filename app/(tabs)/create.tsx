import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, SafeAreaView, useColorScheme } from "react-native";
import brandStyles from "../../constants/styles";
import { saveGraph } from "../../storage/storage";
import { useRouter } from "expo-router";
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard'
import * as Crypto from "expo-crypto";
import { Colors } from "../../constants/Colors";
import ColorSelector from "../../components/ColorSelector";
import IconSelector from "../../components/IconSelector";
import { useNavigation } from "expo-router";
import { useLayoutEffect } from "react";
import { Ionicons } from '@expo/vector-icons';

export default function CreateGraphScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const newId = Crypto.randomUUID();
  const [emojiBoxOpen, setEmojiBoxOpen] = useState(false);
  const [colorOptions] = useState(Object.entries(Colors.cardColors).map(([name, hex]) => ({ name, hex })));
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("📊");
  const [colorIdx, setColorIdx] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colorScheme === "light" ? Colors.text : Colors.white } />
        </TouchableOpacity>
      ),
      title: 'New Graph',
    });
  }, [navigation]);

  useEffect(() => {
    const randomColorIdx = Math.floor(Math.random() * colorOptions.length);
    setColorIdx(randomColorIdx);
  }, []);
  
  const handleSelectEmoji = (emoji: EmojiType) => {
    setEmoji(emoji.emoji);
  }

  // Function to save graph data
  const handleSaveGraph = async () => {
    if (!title) {
      Alert.alert("Error", "Please enter a title for your graph.");
      return;
    }

    const newGraph = {
      id: newId,
      title,
      emoji,
      colorIdx,
      createdAt: new Date().toISOString(),
      settings: {}
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
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
        <View>
          <Text style={brandStyles.formLabel}>Graph Title</Text>
          <TextInput
              style={brandStyles.textInput}
              placeholder="Graph Title"
              value={title}
              onChangeText={setTitle}
          />
        </View>
        
        <View>
          <Text style={brandStyles.formLabel}>Emoji</Text>
          <TouchableOpacity onPress={() => setEmojiBoxOpen(true)} style={brandStyles.buttonTertiary}>
            <View style={brandStyles.flexRowCenter}>
              <Text>{emoji}</Text> 
              <Text>Select an Emoji</Text> 
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <Text style={brandStyles.formLabel}>Color</Text>
            <TouchableOpacity onPress={() => setColorModalOpen(true)} style={brandStyles.buttonTertiary}>
              <View style={brandStyles.flexRowCenter}>
                <View style={[styles.colorSelection, {backgroundColor: colorOptions[colorIdx].hex}]}></View>
                <Text>Select an Color</Text> 
              </View>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleSaveGraph}>
                <Text style={brandStyles.primaryButtonText}>Create Graph</Text>
            </TouchableOpacity>
          </View>

          <EmojiPicker onEmojiSelected={handleSelectEmoji} enableSearchBar open={emojiBoxOpen} onClose={() => setEmojiBoxOpen(false)} />
          <ColorSelector visible={colorModalOpen} onClose={() => setColorModalOpen(false)} colorOptions={colorOptions} currentIdx={colorIdx} onSelect={(idx) => setColorIdx(idx)} />
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: Colors.background.primary,
    justifyContent: "flex-start"
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 20,
    color: Colors.text,
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
