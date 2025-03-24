import { StyleSheet } from "react-native";
import { Colors } from "./Colors";

const brandStyles = StyleSheet.create({
    buttonPrimary: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    buttonSecondary: {
        backgroundColor: Colors.secondary,
        padding: 15,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    buttonTertiary: {
        backgroundColor: Colors.white,
        padding: 15,
        fontWeight: "bold",
        borderColor: Colors.primary,
        borderWidth: 2,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },

    primaryButtonText: {
      color: Colors.white,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },

    secondaryButtonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
    },
    flexRowCenter: {
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 10
    },
    textInput: {
        borderWidth: 1,
        borderColor: Colors.border.light,
        paddingVertical: 15,
        paddingHorizontal: 15,
        marginBottom: 10,
        borderRadius: 100,
        color: Colors.text,
        backgroundColor: Colors.background.input,
        fontSize: 12,
    },
    formLabel: {
        marginBottom: 5,
        fontWeight: "bold",
      },
  });
  
  export default brandStyles;