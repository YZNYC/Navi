import { StyleSheet, Text, View } from 'react-native';

export default function Account() {
  return (
    <View style={styles.container}>
      <Text>Conta</Text>
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