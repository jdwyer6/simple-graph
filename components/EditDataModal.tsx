import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Graph } from '@/types/Graph';

type Props = {
  graph: Graph;
  visible: boolean;
  onClose: () => void;
};

const EditDataModal = ({ graph, visible, onClose }: Props) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Edit Graph</Text>
        <Text>{graph.title}</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 40,
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default EditDataModal;
