import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#e94cc7ff', '#ffffffff']}
        style={StyleSheet.absoluteFill}
      />
      <Text>Welcome to My React Native App!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});