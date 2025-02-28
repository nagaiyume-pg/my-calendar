import { SafeAreaView, StyleSheet, View } from "react-native"

export const ScheduleScreen = () => {
    return(
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}></View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        backgroundColor: "white",
        flex: 1
    }
})