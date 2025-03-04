import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import AgendaScreen from './screens/AgendaScreen.jsx';
import AgendaInfiniteListScreen from './screens/AgendaInfiniteListScreen.jsx';
import CalendarScreen from './screens/CalendarScreen';
import NewCalendarScreen from './screens/NewCalendarScreen.jsx';
import ExpandableCalendarScreen from './screens/ExpandableCalendarScreen.jsx';
import NewCalendarListScreen from './screens/NewCalendarListScreen.jsx';
import PlaygroundScreen from './screens/playgroundScreen.jsx';
import TimelineCalendar from './screens/TimelineCalendar.jsx';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar />
      <TimelineCalendar />
    </SafeAreaView>
  );
}
