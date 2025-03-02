import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { NowIndicator } from "./NowIndicator";
import { Hours } from "./Hours";

/**
 * タイムラインをスクロール可能なビューにラップするコンポーネント。
 *
 * `Timeline` コンポーネントは `Hours` コンポーネントと `NowIndicator` コンポーネントを組み合わせて
 * タイムラインをスクロール可能な形で表示します。
 *
 * @param {TimelineProps} props - `screenWidth` はタイムラインの幅を設定するために使用されます
 * @returns {JSX.Element} タイムラインをスクロール可能なビューでラップしたコンポーネント
 */
interface TimelineProps {
    screenWidth: number;
    height: number;
}

export const Timeline = React.memo(({ screenWidth, height }: TimelineProps): JSX.Element => {

    return(
        <View style={[styles.timelineContainer, {height: height, width: screenWidth}]}>
            <ScrollView>
                <View style={[styles.timeline, {width: screenWidth}]}>
                    <Hours
                        screenWidth={screenWidth}
                    />
                    <NowIndicator
                        top={30}
                        screenWidth={screenWidth}
                    />
                </View>
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    timeline: {
        backgroundColor: "white",
        display: "flex",
        height: 2400 // タイムラインの高さ（画面全体を超える高さに設定）
    },
    timelineContainer: {
        display: "flex"
    },
})