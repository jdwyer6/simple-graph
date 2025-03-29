import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, useColorScheme, Switch, SafeAreaView, KeyboardAvoidingView, Platform } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { getGraphs, saveAllGraphs } from "../../storage/storage";
import { Graph, GraphSettings } from "../../types/Graph";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "../../constants/Colors";
import brandStyles from "../../constants/styles";
import Modal from "react-native-modal";
import { deleteGraph } from "../../storage/storage";
import ColorSelector from "@/components/ColorSelector";
import EditDataModal from "@/components/EditDataModal";
import EmojiPicker, { type EmojiType } from 'rn-emoji-keyboard'

export default function GraphDetailScreen() {
    const router = useRouter();
    const inputRef = useRef<TextInput>(null);
    const colorScheme = useColorScheme();
    const { id } = useLocalSearchParams();
    const navigation = useNavigation();
    const [graph, setGraph] = useState<Graph | null>(null);
    const [newValue, setNewValue] = useState("");
    const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
    const [colorOptions] = useState(Object.entries(Colors.cardColors).map(([name, hex]) => ({ name, hex })));
    const [settings, setSettings] = useState<GraphSettings>();
    const [editDataModalVisible, setEditDataModalVisible] = useState(false);
    const [editPointIndex, setEditPointIndex] = useState<number | null>(null);
    const [editPointVisible, setEditPointVisible] = useState(false);
    const [addPointVisible, setAddPointVisible] = useState(false);
    const [colorModalOpen, setColorModalOpen] = useState(false);
    const [colorIdx, setColorIdx] = useState(0);

    useFocusEffect(
        useCallback(() => {
          const fetchGraph = async () => {
            const graphId = Array.isArray(id) ? id[0] : id;
            const allGraphs = await getGraphs();
            const found = allGraphs.find((g: Graph) => g.id === graphId);
            if (found) {
              setGraph(found);
              setColorIdx(found.colorIdx ?? 0);
              setSettings({
                showPoints: found.settings?.showPoints ?? true,
                smoothLine: found.settings?.smoothLine ?? true,
                grid: found.settings?.grid ?? true,
                xAxisLabel: found.settings?.xAxisLabel ?? '',
                yAxisLabel: found.settings?.yAxisLabel ?? '',
                minimumYValue: found.settings?.minimumYValue ?? 0,
                maximumYValue: found.settings?.maximumYValue ?? 100,
                YInterval: found.settings?.YInterval ?? 1,
                decimalPlaces: found.settings?.decimalPlaces ?? 0,
              });
      
              navigation.setOptions({ 
                title: `${found.emoji} ${found.title}`,
                headerBackTitle: 'Home',
                headerRight: () => (
                  <TouchableOpacity onPress={() => setSettingsDrawerVisible(true)} style={{ marginRight: 16 }}>
                    <Feather name="settings" size={24} color={colorScheme === 'light' ? Colors.text : Colors.white} />
                  </TouchableOpacity>
                ),
              });
            }
          };
      
          fetchGraph();
        }, [id])
    );

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

    const handleDeleteDataPoint = async (index: number) => {
        if (!graph || typeof index !== 'number') return;
      
        const updatedData = [...(graph.data ?? [])];
        updatedData.splice(index, 1);
      
        const updatedGraph = { ...graph, data: updatedData };
      
        const allGraphs = await getGraphs();
        const updatedGraphs = allGraphs.map((g:Graph) =>
          g.id === graph.id ? updatedGraph : g
        );
      
        await saveAllGraphs(updatedGraphs);
        setEditPointVisible(false);
        setGraph(updatedGraph);
      };
      

    const handleClickEditGraph = () => {
        router.push(`/graph/edit/${id}`)
        setSettingsDrawerVisible(false);
    }

    const handleClickEditPoint = (index: number) => {
        if (!graph?.data) return;
        setEditPointIndex(index);
        setNewValue(graph.data[index][1].toString());
        setEditPointVisible(true);
    }

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
        setAddPointVisible(false);
    };

    const handleSaveEditedPoint = async () => {
        if (!graph || editPointIndex === null) return;
      
        const y = parseFloat(newValue);
        if (isNaN(y)) {
          Alert.alert("Invalid input", "Please enter a numeric value.");
          return;
        }
      
        const updatedData = [...(graph.data ?? [])];
        updatedData[editPointIndex] = [updatedData[editPointIndex][0], y];
      
        const updatedGraph = { ...graph, data: updatedData };
      
        const allGraphs = await getGraphs();
        const updatedGraphs = allGraphs.map((g: Graph) =>
          g.id === graph.id ? updatedGraph : g
        );
      
        await saveAllGraphs(updatedGraphs);
        setGraph(updatedGraph);
        setEditPointVisible(false);
        setEditPointIndex(null);
        setNewValue(""); // Reset input
    };
      

    const handleUpdateSettings = async () => {
        const updatedGraph: Graph = {
        ...graph!,
        colorIdx,
        settings,
        };

        const allGraphs = await getGraphs();
        const updatedGraphs = allGraphs.map((g: Graph) =>
        g.id === id ? updatedGraph : g
        );
        await saveAllGraphs(updatedGraphs);
        setGraph(updatedGraph);
    }

    function camelToTitle(camelCaseStr:string) {
        return camelCaseStr
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, (str) => str.toUpperCase()); 
    }
      

    if (!graph) return <Text>Loading...</Text>;
    const xVals = graph.data?.map((point) => point[0]) ?? [];
    let yVals = graph.data?.map((point) => point[1]) ?? [];
    const minY = settings?.minimumYValue ?? Math.min(...yVals);
    const maxY = settings?.maximumYValue ?? Math.max(...yVals);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAwareScrollView
                style={styles.container}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={20}
            >
            
                <View style={styles.graphActionContainer}>
                    <TouchableOpacity style={styles.graphActionButton} onPress={() => setAddPointVisible(true)}><AntDesign name="pluscircleo" size={24} color={Colors.white} /></TouchableOpacity>
                </View>


                <Modal
                    isVisible={addPointVisible}
                    onBackdropPress={() => setAddPointVisible(false)}
                    onBackButtonPress={() => setAddPointVisible(false)}
                    style={{ justifyContent: 'flex-end', margin: 0 }}
                    swipeDirection="down"
                    onSwipeComplete={() => setAddPointVisible(false)}
                    backdropOpacity={0.3}
                    avoidKeyboard
                    onModalShow={()=>inputRef.current?.focus()}
                >
                    <View style={styles.drawer}>
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
                            <Text style={brandStyles.primaryButtonText}>Add Data Point</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>


                {Array.isArray(graph.data) && graph.data.length > 0 && (
                    <LineChart
                    onDataPointClick={(data) => {
                        Alert.alert(
                            "Data Point Options",
                            `Value: ${data.value}`,
                            [
                                {
                                    text: "Edit",
                                    onPress: () => {
                                        handleClickEditPoint(data.index);
                                    },
                                },
                                {
                                    text: "Back",
                                    style: "cancel",
                                },
                            ]
                          );
                          
                      }}
                    data={{
                        labels: xVals.map(String),
                        datasets: [
                            {
                                data: [
                                    ...yVals
                                  ],
                                withDots: settings?.showPoints,
                            },
                            {
                                data: [minY, maxY], //Ghost Points for Min and Max Y
                                withDots: false,
                                strokeWidth: 0,
                                color: () => 'transparent',
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 40}
                    height={Dimensions.get("window").height - 400}
                    yAxisInterval={settings?.YInterval}
                    xAxisLabel={` ${settings?.xAxisLabel}`}
                    yAxisSuffix={` ${settings?.yAxisLabel}`}
                    chartConfig={{
                        backgroundColor: "#fff",
                        backgroundGradientFrom: Colors.white,
                        backgroundGradientTo: Colors.white,
                        color: () => colorOptions[graph.colorIdx].hex,
                        labelColor: () => Colors.text,
                        strokeWidth: 1,
                        propsForDots: {
                            r: "3",
                            strokeWidth: "1",
                            stroke: Colors.gray.darkest,
                        },
                        propsForBackgroundLines: {
                            strokeDasharray: "",
                            stroke: settings?.grid ? Colors.gray.light : 'transparent'
                        },
                        decimalPlaces: settings?.decimalPlaces,
                        fillShadowGradientFrom: 'rgba(0,0,0,0)',
                        fillShadowGradientTo: 'rgba(0,0,0,0)',
                        fillShadowGradientFromOpacity: 0,
                        fillShadowGradientToOpacity: 0,
                        fillShadowGradientOpacity: 0,
                    }}
                    bezier={settings?.smoothLine}
                    style={{ marginVertical: 20, borderRadius: 10, marginLeft: settings?.yAxisLabel ? 0 : -20 }}
                    />
                )}

                <Modal
                    isVisible={editPointVisible}
                    onBackdropPress={() => setEditPointVisible(false)}
                    onBackButtonPress={() => setEditPointVisible(false)}
                    style={[styles.modal, {marginTop: 50}]}
                    swipeDirection="down"
                    onSwipeComplete={() => setEditPointVisible(false)}
                    backdropOpacity={0.3}
                >
                    <KeyboardAwareScrollView
                        style={styles.settingsContainer}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={20}
                    >
                        <View style={styles.drawer}>
                            <View style={{ alignItems: 'center' }}>
                                <MaterialIcons name="drag-handle" size={24} color="black" />
                            </View>
                            <View>
                                <Text style={styles.title}>Edit Data Point</Text>
                                <TouchableOpacity onPress={() => handleDeleteDataPoint(editPointIndex as number)}>
                                    <Text style={[styles.drawerItem, { color: 'red' }]}>Delete Point</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <Text style={brandStyles.formLabel}>New Y Value</Text>
                            <TextInput
                                ref={inputRef} 
                                style={brandStyles.textInput}
                                placeholder="Enter Y value"
                                value={newValue}
                                onChangeText={setNewValue}
                                keyboardType="numeric"
                            />
                            <TouchableOpacity style={brandStyles.buttonPrimary} onPress={handleSaveEditedPoint}>
                                <Text style={brandStyles.primaryButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>

                </Modal>

                <Modal
                    isVisible={settingsDrawerVisible}
                    onBackdropPress={() => setSettingsDrawerVisible(false)}
                    onBackButtonPress={() => setSettingsDrawerVisible(false)}
                    style={[styles.modal, {marginTop: 50}]}
                    swipeDirection="down"
                    onSwipeComplete={() => setSettingsDrawerVisible(false)}
                    backdropOpacity={0.3}
                >
                    <KeyboardAwareScrollView
                        style={styles.settingsContainer}
                        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-between" }}
                        keyboardShouldPersistTaps="handled"
                        extraScrollHeight={20}
                    >
                        <View style={styles.drawer}>
                            <View style={{ alignItems: 'center' }}>
                                <MaterialIcons name="drag-handle" size={24} color="black" />
                            </View>
                            <Text style={styles.title}>Settings</Text>
                            <TouchableOpacity onPress={() => handleDeleteGraph(Array.isArray(id) ? id[0] : id)}>
                                <Text style={[styles.drawerItem, { color: 'red' }]}>Delete Graph</Text>
                            </TouchableOpacity>
                            {settings && Object.entries(settings).map(([key, value]) => (
                                <View key={key} style={styles.settingRow}>
                                <Text style={styles.settingLabel}>{camelToTitle(key)}</Text>

                                {typeof value === 'boolean' ? (
                                    <Switch
                                    value={value}
                                    onValueChange={(newValue) => {
                                        if (!settings) return;
                                        setSettings({
                                        ...settings,
                                        [key]: newValue,
                                        });
                                    }}
                                    />
                                ) : (
                                    <TextInput
                                    style={styles.settingInput}
                                    keyboardType={typeof value === 'number' ? 'numeric' : 'default'}
                                    value={String(value)}
                                    onChangeText={(newText) => {
                                        if (!settings) return;
                                        setSettings({
                                        ...settings,
                                        [key]: typeof value === 'number' ? Number(newText) : newText,
                                        });
                                    }}
                                    />
                                )}
                                </View>
                            ))}

                            <TouchableOpacity style={brandStyles.buttonTertiary} onPress={()=>setColorModalOpen(true)}>
                                <Text style={brandStyles.secondaryButtonText}>Color</Text>
                            </TouchableOpacity>

                            <ColorSelector visible={colorModalOpen} onClose={() => setColorModalOpen(false)} colorOptions={colorOptions} currentIdx={colorIdx} onSelect={(idx) => setColorIdx(idx)} />
                            <TouchableOpacity style={brandStyles.buttonSecondary} onPress={()=>handleClickEditGraph()}>
                                <Text style={brandStyles.primaryButtonText}>Edit Graph Data</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={brandStyles.buttonPrimary}   
                                onPress={async () => {
                                    await handleUpdateSettings();
                                    setSettingsDrawerVisible(false);
                                }}
                            >
                                <Text style={brandStyles.primaryButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                </Modal>
            </KeyboardAwareScrollView>
            {graph && (
                    <EditDataModal
                        graph={graph}
                        visible={editDataModalVisible}
                        onClose={() => setEditDataModalVisible(false)}
                    />
                )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
  },
  settingsContainer: {
    backgroundColor: Colors.background.primary,
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
  graphActionContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  graphActionButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 24,
  }
});
