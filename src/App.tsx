import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return(
    <SafeAreaProvider>
    </SafeAreaProvider>
  )
}

let AppEntryPoint = App;

if (process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true") {
  AppEntryPoint = require("../.storybook").default;
}

export default AppEntryPoint;
