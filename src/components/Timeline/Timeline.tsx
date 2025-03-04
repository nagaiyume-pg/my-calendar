import React from "react";
import { ScrollView, StyleSheet } from "react-native"
import Hours from "./Hours";

interface TimelineProps {
    startTime: number;
    endTime: number;
    hourHeight: number;
    dimensionWidth: number;
    verticalLineLeftInset: number;
}

const Timeline = (props: TimelineProps) => {
    const {startTime, endTime, hourHeight, dimensionWidth, verticalLineLeftInset} = props;

    const timelineHeight = (endTime - startTime) * hourHeight;

    return(
        <ScrollView
            contentContainerStyle={[styles.timelineContent, { height: timelineHeight }]}
            style={styles.timelineContainer}
        >
            <Hours
                startTime={startTime}
                endTime={endTime}
                dimensionWidth={dimensionWidth}
                hourHeight={hourHeight}
                verticalLineLeftInset={verticalLineLeftInset}
            />
        </ScrollView>
    )
}

export default React.memo(Timeline);

const styles = StyleSheet.create({
    timelineContainer: {
        backgroundColor: "white"
    },
    timelineContent: {
        flexDirection: "row"
    }
})