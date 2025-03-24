import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, useColorScheme, Switch, SafeAreaView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import { getGraphs, saveAllGraphs } from "../../storage/storage";
import { Graph, GraphSettings } from "../../types/Graph";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "../../constants/Colors";
import brandStyles from "../../constants/styles";
import Modal from "react-native-modal";
import { deleteGraph } from "../../storage/storage";

export default function GraphDetailScreen() {
    const router = useRouter();
    const inputRef = useRef<TextInput>(null);
    const colorScheme = useColorScheme();
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [graph, setGraph] = useState<Graph | null>(null);
    const [newValue, setNewValue] = useState("");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [colorOptions] = useState(Object.entries(Colors.cardColors).map(([name, hex]) => ({ name, hex })));
    const [settings, setSettings] = useState<GraphSettings>({
        showPoints: graph?.settings?.showPoints ?? false,
        smoothLine: graph?.settings?.smoothLine ?? true,
        xAxisLabel: graph?.settings?.xAxisLabel ?? '',
        yAxisLabel: graph?.settings?.yAxisLabel ?? '',
        minimumYValue: graph?.settings?.minimumYValue ?? 0,
        maximumYValue: graph?.settings?.maximumYValue ?? 100,
        YInterval: graph?.settings?.YInterval ?? 1,
        decimalPlaces: graph?.settings?.decimalPlaces ?? 0,
        showDots: graph?.settings?.showDots ?? false,
    });

    useEffect(() => {
        const fetch = async () => {
        const allGraphs = await getGraphs();
        const found = allGraphs.find((g: Graph) => g.id === id);
        if (found) {
            setGraph(found);
            navigation.setOptions({ 
                title: `${found.emoji} ${found.title}`,
                headerBackTitle: 'Home',
                headerRight: () => (
                    <TouchableOpacity onPress={() => setDrawerVisible(true)} style={{ marginRight: 16 }}>
                    <Feather name="settings" size={24} color={colorScheme === 'light' ? Colors.text : Colors.white} />
                    </TouchableOpacity>
                ),
            });
        }
        };
        fetch();
    }, [id]);

    const handleDeleteGraph = (id: string) => {
        Alert.alert(
        "Delete Graph?",
        "Are you sure you want to delete this graph?",
        [
            { text: "Cancel", style: "cancel" },
            {
            text: "Delete",
            style: "destructive",
            onPress: async () => {
                await deleteGraph(id);
                router.back();
            },
            },
        ]
        );
    };

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

    const handleUpdateSettings = async () => {
        const updatedGraph: Graph = {
        ...graph!,
        settings,
        };

        const allGraphs = await getGraphs();
        const updatedGraphs = allGraphs.map((g: Graph) =>
        g.id === id ? updatedGraph : g
        );
        await saveAllGraphs(updatedGraphs);
        setGraph(updatedGraph);
        setDrawerVisible(false);
    }

    function camelToTitle(camelCaseStr:string) {
        return camelCaseStr
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()); 
    }
      

    if (!graph) return <Text>Loading...</Text>;
    const xVals = graph.data?.map((point) => point[0]) ?? [];
    const yVals = graph.data?.map((point) => point[1]) ?? [];

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20} // Adjust as needed
            >
                {Array.isArray(graph.data) && graph.data.length > 0 && (
                    <LineChart
                    data={{
                        labels: xVals.map(String),
                        datasets: [
                            {
                                data: [20, ...yVals, 50],
                                withDots: false
                            }
                        ],
                    }}
                    width={Dimensions.get("window").width - 0}
                    height={Dimensions.get("window").height - 400}
                    yAxisInterval={1}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        color: () => colorOptions[graph.colorIdx].hex,
                        labelColor: () => Colors.text,
                        strokeWidth: 1,
                        propsForDots: {
                            r: "3",
                            strokeWidth: "0",
                            stroke: Colors.gray.darkest,
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: "",
                            stroke: "transparent",
                        },
                        decimalPlaces: graph.settings?.decimalPlaces ?? 0,
                    }}
                    bezier
                    style={{ marginVertical: 20, borderRadius: 10 }}
                    
                    />
                )}

                <View>
                    <Text style={brandStyles.formLabel}>New Data Point (Y)</Text>
                    <TextInput
                        ref={inputRef} 
                        style={brandStyles.textInput}
                        placeholder="Enter Y value"
                        value={newValue}
                        onChangeText={setNewValue}
                        keyboardType="numeric"
                    />
                    <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleAddPoint}>
                        <Text style={brandStyles.primaryButtonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    isVisible={drawerVisible}
                    onBackdropPress={() => setDrawerVisible(false)}
                    onBackButtonPress={() => setDrawerVisible(false)}
                    style={styles.modal}
                    swipeDirection="down"
                    onSwipeComplete={() => setDrawerVisible(false)}
                    backdropOpacity={0.3}
                >
                    <KeyboardAwareScrollView
                        style={styles.container}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={20}
                    >
                        <View style={styles.drawer}>
                            {Object.entries(settings).map(([key, value]) => (
                                <View key={key} style={styles.settingRow}>
                                <Text style={styles.settingLabel}>{camelToTitle(key)}</Text>

                                {typeof value === 'boolean' ? (
                                    <Switch
                                    value={value}
                                    onValueChange={(newValue) =>
                                        setSettings((prev) => ({ ...prev, [key]: newValue }))
                                    }
                                    />
                                ) : (
                                    <TextInput
                                    style={styles.settingInput}
                                    keyboardType={typeof value === 'number' ? 'numeric' : 'default'}
                                    value={String(value)}
                                    onChangeText={(newText) =>
                                        setSettings((prev) => ({
                                        ...prev,
                                        [key]: typeof value === 'number' ? Number(newText) : newText,
                                        }))
                                    }
                                    />
                                )}
                                </View>
                            ))}
                            <TouchableOpacity onPress={() => handleDeleteGraph(Array.isArray(id) ? id[0] : id)}>
                                <Text style={[styles.drawerItem, { color: 'red' }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  drawer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  drawerItem: {
    fontSize: 18,
    paddingVertical: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  settingInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
    backgroundColor: Colors.background.input,
  },
});
