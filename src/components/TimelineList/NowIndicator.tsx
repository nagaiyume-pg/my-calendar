import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * 現在時刻を示すインジケータを描画するコンポーネント。
 *
 * `NowIndicator` コンポーネントは現在時刻を示す赤いインジケータを表示します。
 * 現在時刻の表示部分が動的に更新される場合、後で追加することができます。
 *
 * @param {NowIndicatorProps} props - インジケータの位置と幅を調整するためのプロパティ
 * @returns {JSX.Element} 現在時刻を示すインジケータ
 */
interface NowIndicatorProps {
    top: number;   // インジケータの上側位置
    screenWidth: number;
}

export const NowIndicator = React.memo(({ top, screenWidth }: NowIndicatorProps): JSX.Element => {
    return(
        <View style={[styles.nowIndicator, { top: top }]}>
            <View style={[styles.nowIndicatorLine, { width: screenWidth - 50 }]}/>
            <View style={styles.nowIndicatorKnob}/>
        </View>
    );
});

const styles = StyleSheet.create({
    nowIndicator: {
        left: 50,
        position: 'absolute', // 現在時刻インジケータの絶対配置
    },
    nowIndicatorLine: {
        height: 1,
        backgroundColor: 'red', // 現在時刻インジケータのラインの色
        position: 'absolute',
        left: 0
    },
    nowIndicatorKnob: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: 'red', // 現在時刻インジケータのノブの色
        position: 'absolute',
        left: -3,
        top: -3
    },
})