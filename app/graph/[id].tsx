import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Pressable} from "react-native";
import Entypo from '@expo/vector-icons/Entypo';
import { getGraphs, saveAllGraphs } from "../../storage/storage";
import { Graph } from "../../types/Graph";
// import { LineChart } from "react-native-chart-kit";
import { Colors } from "../../constants/Colors";
import brandStyles from "../../constants/styles";
import Modal from "react-native-modal";
import { deleteGraph } from "../../storage/storage";
import { LineChart } from 'react-native-svg-charts';

export default function GraphDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [graph, setGraph] = useState<Graph | null>(null);
    const [newValue, setNewValue] = useState("");
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [colorOptions] = useState(Object.entries(Colors.cardColors).map(([name, hex]) => ({ name, hex })));

    useEffect(() => {
        const fetch = async () => {
        const allGraphs = await getGraphs();
        const found = allGraphs.find((g: Graph) => g.id === id);
        if (found) {
            setGraph(found);
            navigation.setOptions({ 
                title: `${found.emoji} ${found.title}`,
                headerRight: () => (
                    <TouchableOpacity onPress={() => setDrawerVisible(true)} style={{ marginRight: 16 }}>
                    <Entypo name="dots-three-vertical" size={22} color="#333" />
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

    if (!graph) return <Text>Loading...</Text>;

    const xVals = graph.data?.map((point) => point[0]) ?? [];
    const yVals = graph.data?.map((point) => point[1]) ?? [];

    return (
        
        <View style={styles.container}>
            {Array.isArray(graph.data) && graph.data.length > 0 && (
                // <LineChart
                // data={{
                //     labels: xVals.map(String),
                //     datasets: [
                //         {
                //             data: [20, ...yVals, 50],
                //             withDots: false
                //         }
                //     ],
                // }}
                // width={Dimensions.get("window").width - 40}
                // height={Dimensions.get("window").height - 300}
                // yAxisInterval={1}
                // yAxisLabel=""
                // yAxisSuffix=""
                // chartConfig={{
                //     backgroundColor: "#fff",
                //     backgroundGradientFrom: Colors.white,
                //     backgroundGradientTo: Colors.white,
                //     color: () => colorOptions[graph.colorIdx].hex,
                //     labelColor: () => Colors.text,
                //     strokeWidth: 1,
                //     propsForDots: {
                //     r: "3",
                //     strokeWidth: "0",
                //     stroke: Colors.gray.darkest,
                //     },
                //     propsForBackgroundLines: {
                //         strokeDasharray: "", // ← removes the dotted lines
                //         stroke: "transparent", // ← hides the lines completely
                //     },
                //     decimalPlaces: 0,
                // }}
                // bezier
                // style={{ marginVertical: 20, borderRadius: 10 }}
                
                // />

                <View style={{ height: 200, padding: 20 }}>
      <LineChart
        style={{ flex: 1 }}
        data={graph.data.map(([x, y]) => y)}
        svg={{ stroke: '#056270' }}
        contentInset={{ top: 20, bottom: 20 }}
      />
    </View>
            )}



            <Text style={brandStyles.formLabel}>New Data Point (Y)</Text>
            <TextInput
                style={brandStyles.textInput}
                placeholder="Enter Y value"
                value={newValue}
                onChangeText={setNewValue}
                keyboardType="numeric"
            />

            <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleAddPoint}>
                <Text style={brandStyles.primaryButtonText}>Add</Text>
            </TouchableOpacity>

            <Modal
                isVisible={drawerVisible}
                onBackdropPress={() => setDrawerVisible(false)}
                onBackButtonPress={() => setDrawerVisible(false)}
                style={styles.modal}
                swipeDirection="down"
                onSwipeComplete={() => setDrawerVisible(false)}
                backdropOpacity={0.3}
                >
                <View style={styles.drawer}>
                    <TouchableOpacity onPress={() => { setDrawerVisible(false); Alert.alert("Edit tapped"); }}>
                    <Text style={styles.drawerItem}>Edit Data</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteGraph(Array.isArray(id) ? id[0] : id)}>
                    <Text style={styles.drawerItem}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setDrawerVisible(false)}>
                    <Text style={[styles.drawerItem, { color: 'red' }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
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
});
