import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as IconSets from '@expo/vector-icons';

type IconOption = {
  name: string;
  set: keyof typeof IconSets;
};

type Props = {
  onSelect: (icon: IconOption) => void;
};

const allIcons: IconOption[] = [];

// Extract all icon sets and icon names
Object.entries(IconSets).forEach(([setName, set]) => {
  if (typeof set.getRawGlyphMap === 'function') {
    const icons = Object.keys(set.getRawGlyphMap());
    icons.forEach((iconName) => {
      allIcons.push({ name: iconName, set: setName as keyof typeof IconSets });
    });
  }
});

export default function IconSelector({ onSelect }: Props) {
  const [search, setSearch] = useState('');

  const filteredIcons = allIcons.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search icons..."
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <FlatList
        data={filteredIcons.slice(0, 100)} // limit results for performance
        keyExtractor={(item) => `${item.set}-${item.name}`}
        numColumns={4}
        renderItem={({ item }) => {
          const IconComponent = IconSets[item.set];
          return (
            <TouchableOpacity
              style={styles.iconWrapper}
              onPress={() => onSelect(item)}
            >
              <IconComponent name={item.name} size={28} color="#333" />
              <Text style={styles.iconName}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  search: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 15,
  },
  iconName: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
});
