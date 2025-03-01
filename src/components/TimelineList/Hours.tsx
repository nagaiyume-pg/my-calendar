import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import range from 'lodash/range';

interface HoursProps {
    screenWidth: number; // 画面の幅
}

export const Hours = ({screenWidth}: HoursProps) => {

    const start = 0, end = 24;
    const hours = useMemo(() => {
        return range(start, end + 1).map(i => {
            let timeText;

            if (i === start) {
                timeText = '';
            } else if (i < 10) {
                timeText = `0${i}:00`;
            } else if (i > 12) {
                timeText =  `${i}:00`;
            }
            return {timeText, time: i};
        });
    }, [start, end]);

    return(
        <View style={styles.container}>
            {hours.map(({timeText, time}, index) => {
                return (
                    <View key={time} style={styles.hours}>
                        <Text key={`timeLabel${time}`} style={[styles.timeLabel, {top: 100 * index - 6, width: 0 - 16}]}>
                            {timeText}
                        </Text>
                        {time === start ? null : (
                            <View
                                key={`line${time}`}
                                style={[styles.line, {top: 100 * index, width: screenWidth - 20, left: 0 - 16}]}
                            />
                        )}
                        {
                            <View
                                key={`lineHalf${time}`}
                                style={[styles.line, {top: 100 * (index + 0.5), width: screenWidth - 20, left: 0 - 16}]}
                            />
                        }
                    </View>
                );
            })
        }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        height: 2400,
        backgroundColor: "blue",
        width: 375
    },
    hours: {
        display: "flex",
        height: 2400
    },
    timeLabel: {
        color: "blue",
        fontSize: 10,
        fontWeight: '500',
        paddingLeft: 12,
        textAlign: 'center',
        position: 'absolute'
    },
    line: {
        height: 1,
        backgroundColor: "red",
        position: 'absolute'
    }
})