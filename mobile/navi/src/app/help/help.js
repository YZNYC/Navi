import { StyleSheet, Text, View } from 'react-native';

export default function Help() {
  return (
    <View style={styles.container}>
      <Text>Ajuda</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b9ee0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});