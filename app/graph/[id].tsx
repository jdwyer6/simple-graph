import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getGraphs } from '../../storage/storage';
import { Colors } from '../../constants/Colors';

export default function GraphDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [graph, setGraph] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => {
      const allGraphs = await getGraphs();
      const found = allGraphs.find((g: any) => g.id === id);
      setGraph(found);

      if (found?.title) {
        navigation.setOptions({ title: found.title });
      }
    };

    fetch();
  }, [id]);

  if (!graph) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{graph.emoji} {graph.title}</Text>
      <Text>X-Axis: {graph.xAxis}</Text>
      <Text>Y-Axis: {graph.yAxis}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
