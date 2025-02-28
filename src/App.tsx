import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScheduleScreen } from './screens';

const App = () => {
  return(
    <SafeAreaProvider>
      <ScheduleScreen />
    </SafeAreaProvider>
  )
}

export default App;
