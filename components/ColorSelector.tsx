import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import brandStyles from "../constants/styles";

interface ColorOption {
  name: string;
  hex: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  colorOptions: ColorOption[];
  onSelect: (index: number) => void;
  currentIdx: number;
}

export default function ColorSelector({
  visible,
  onClose,
  colorOptions,
  onSelect,
  currentIdx,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Select a Color</Text>

          <FlatList
            data={colorOptions}
            keyExtractor={(item) => item.name}
            numColumns={4}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.swatch,
                  {
                    backgroundColor: item.hex,
                    borderWidth: index === currentIdx ? 2 : 0,
                    borderColor: "#333",
                  },
                ]}
                onPress={() => {
                  onSelect(index);
                  onClose();
                }}
              />
            )}
          />

          <TouchableOpacity style={brandStyles.buttonSecondary} onPress={onClose}>
            <Text style={brandStyles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  swatch: {
    width: 60,
    height: 60,
    borderRadius: 10,
    margin: 5,
  },
});
