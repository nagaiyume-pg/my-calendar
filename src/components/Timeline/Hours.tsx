import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import range from 'lodash/range';

import {
    useFonts,
    NotoSansJP_400Regular
} from '@expo-google-fonts/noto-sans-jp';

/**
 * `Hours` コンポーネントに渡されるプロパティを定義するインターフェース。
 *
 * @interface HoursProps
 */
export interface HoursProps {
    /**
     * 表示する開始時間（24時間制）。例: 9 は 09:00。
     *
     * @type {number}
     */
    startTime: number;

    /**
     * 表示する終了時間（24時間制）。例: 18 は 18:00。
     *
     * @type {number}
     */
    endTime: number;

    /**
     * 1時間ごとの高さ（単位: ピクセル）。
     *
     * @type {number}
     */
    hourHeight: number;

    /**
     * 時間軸全体の幅（単位: ピクセル）。
     *
     * @type {number}
     */
    dimensionWidth: number;

    /**
     * 縦ラインの左側のインセット（単位: ピクセル）。
     *
     * @type {number}
     */
    verticalLineLeftInset: number;
}

/**
 * 時間軸の時間ラベルと関連するラインを描画するコンポーネント。
 *
 * 指定された開始時間と終了時間に基づいて、時間ラベルと時間のラインを描画します。
 * 複数日の時間軸にも対応し、各日を垂直ラインで区切ります。
 *
 * @param {HoursProps} props コンポーネントのプロパティ
 * @returns {JSX.Element} 時間軸を描画するJSX要素
 */
const Hours = (props: HoursProps) => {
    const {
        startTime,
        endTime,
        hourHeight,
        dimensionWidth,
        verticalLineLeftInset,
    } = props;

    const lineLeftInset: number = 36;

    const [fontsLoaded] = useFonts({
        NotoSansJP_400Regular, // 日本語フォントを読み込む
    });

    /**
     * 開始時間から終了時間までの時間を計算し、時間ラベルを作成します。
     *
     * `startTime` と `endTime` に基づいて、時間ラベルを計算します。
     * 時間が 10 時未満の場合は、`0` を追加し、24 時間制に合わせた形式で表示します。
     *
     * @returns {Array} 時間ラベルと時間を格納した配列
     */
    const hours = useMemo(() => {
        return range(startTime, endTime + 1).map(i => {
            let timeText;

            if (i === startTime || i === endTime) {
                timeText = ''; // 開始時間にはラベルを表示しない
            } else if (i < 10) {
                timeText = `0${i}:00`; // 10未満の時間には`0`を追加
            } else if (i > 10) {
                timeText = `${i}:00`; // 10以上の時間にはそのまま表示
            }
            return { timeText, time: i }; // ラベルと時間のペアを返す
        });
    }, [startTime, endTime]);

    // フォントが読み込まれていない場合、何も表示しない
    if (!fontsLoaded) {
        return (
            <View style={styles.errorScreen}>
                <Text>フォントが読み込まれていません</Text>
            </View>
        );
    } else {
        return (
            <>
                {hours.map(({ timeText, time }, index) => {
                    return (
                        <React.Fragment key={time}>
                            {/* 時間ラベルを描画 */}
                            <Text
                                key={`timeLabel${time}`}
                                style={[styles.timeLabel, { top: hourHeight * index - 6, fontFamily: "NotoSansJP_400Regular" }]}
                            >
                                {timeText}
                            </Text>
                            {/* 時間ラベルが開始時間でない場合、横線を描画 */}
                            <View
                                key={`line${time}`}
                                style={[styles.line, { top: hourHeight * index, width: dimensionWidth - 36, left: lineLeftInset }]} // `lineLeftInset` を使用
                            />
                            {/* 時間ラベルの中央にラインを描画 */}
                            {time === endTime ? null : (
                                <View
                                    key={`lineHalf${time}`}
                                    style={[styles.line, { top: hourHeight * (index + 0.5), width: dimensionWidth - 36, left: lineLeftInset }]} // `lineLeftInset` を使用
                                />
                            )}
                        </React.Fragment>
                    );
                })}
                {/* 垂直ライン */}
                <View
                    style={[styles.verticalLine, { left: verticalLineLeftInset }]} // `verticalLineLeftInset` を使用
                />
            </>
        );
    }
};

export default React.memo(Hours);

const styles = StyleSheet.create({
    errorScreen: {
        alignItems: "center", // 中央揃え
        flex: 1, // 画面全体の高さ
        justifyContent: "center", // 中央揃え
    },
    timeLabel: {
        color: "black", // 文字色を黒に設定
        fontSize: 10, // フォントサイズを小さめに設定
        paddingLeft: 5, // 左側の余白
        paddingBottom: 1, // 文字の高さを調整
        position: 'absolute', // 絶対配置
    },
    line: {
        height: 1, // ラインの高さ
        backgroundColor: "black", // ラインの色
        position: 'absolute', // 絶対配置
    },
    verticalLine: {
        width: 1, // 縦ラインの幅
        backgroundColor: 'black', // 縦ラインの色
        position: 'absolute', // 絶対配置
        height: '100%', // 画面全体の高さ
    },
})
