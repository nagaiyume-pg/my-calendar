import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Timeline } from "./Timeline";


export const EventBlock = React.memo((): JSX.Element => {
    return(
        <View>
            <Text>イベント</Text>
        </View>
    )
})

/**
 * タイムラインをスクロール可能なリストとして表示するコンポーネント。
 *
 * `TimelineList` コンポーネントはタイムラインの内容をスクロール可能なリストとして表示します。
 * 将来的には、タイムラインに関連するコンテンツを追加できる場所として使用します。
 *
 * @returns {JSX.Element} タイムラインをスクロールビュー内でラップしたコンポーネント
 */
interface TimelineListProps {
    screenWidth: number;
}

export const TimelineList = React.memo(({ screenWidth }: TimelineListProps): JSX.Element => {
    const [currentIndex, setCurrentIndex] = useState(0); // 現在表示しているタイムラインのインデックス

    const dates = ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07"];

    const onGestureEvent = useCallback((event: any) => {
        // ここでスワイプの進行方向や動作を解析し、インデックスを更新
        const { translationX } = event.nativeEvent;

        if (translationX < -100) { // 左にスワイプ
            if (currentIndex < dates.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        } else if (translationX > 100) { // 右にスワイプ
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        }
    }, [currentIndex, dates.length]);

    const renderItem = useCallback(({ item }: any) => (
        <Timeline
            screenWidth={screenWidth}
            height={667}
        />
    ), [screenWidth]);

    return (
        <GestureHandlerRootView style={styles.timelineList}>
            <PanGestureHandler onGestureEvent={onGestureEvent}>
                <FlashList
                    data={dates} // 表示するデータ
                    renderItem={renderItem} // アイテムを描画
                    keyExtractor={(item) => item.toString()} // アイテムのキーを設定
                    horizontal={true} // 横スクロールを有効にする
                    scrollEnabled={false} // FlashListの標準スクロールを無効にする
                    initialScrollIndex={currentIndex} // 現在のインデックスから開始
                />
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
});

// コンポーネント用のスタイル
const styles = StyleSheet.create({
    timelineList: {
        flex: 1, // リストが画面全体を占めるようにする
    },
});
