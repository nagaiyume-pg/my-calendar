import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import range from 'lodash/range';
import {
    useFonts,
    NotoSansJP_400Regular
} from '@expo-google-fonts/noto-sans-jp';
import * as SplashScreen from 'expo-splash-screen';
import { calcTimeOffset } from "@/utils";

SplashScreen.preventAutoHideAsync();

/**
 * `Hours` コンポーネントのプロパティ。
 *
 * `screenWidth` は、タイムラインのレイアウトを調整するために画面の幅を渡すために使用されます。
 * @interface HoursProps
 */
interface HoursProps {
    start: number;
    end: number;
    screenWidth: number; // 画面の幅（レイアウト調整に使用）
}

/**
 * 1日分の時間のタイムラインを表示するコンポーネント。
 *
 * `Hours` コンポーネントは、0時から24時までの時間を1時間ごとに表示し、
 * タイムラインをスクロールできる形で描画します。このコンポーネントは、主に時間を表示する
 * インターフェースの一部として使用されます。
 *
 * @param {HoursProps} props - `screenWidth` プロパティを持つコンポーネントのプロパティ。
 * @returns {JSX.Element} 時間のタイムラインを描画したコンポーネント
 */
export const Hours = ({ start = 0, end = 24, screenWidth }: HoursProps): JSX.Element => {
    const [fontsLoaded] = useFonts({
        NotoSansJP_400Regular, // 日本語フォントを読み込む
    });

    // 時間を0時から24時までリストとして生成
    const hours = useMemo(() => {
        return range(start, end + 1).map(i => {
            let timeText;

            // 時間表示をフォーマット
            if (i === start) {
                timeText = ''; // 0時のラベルは表示しない
            } else if (i < 10) {
                timeText = `0${i}:00`; // 01:00 など、2桁で表示
            } else {
                timeText = `${i}:00`; // 10:00 以降はそのまま
            }
            return { timeText, time: i }; // timeText（表示用）と time（数値）を返す
        });
    }, [start, end]);

    // フォントが読み込まれていない場合、何も表示しない
    if (!fontsLoaded) {
        return (
            <React.Fragment /> // フォントが読み込まれるまで表示しない
        );
    }

    return (
        <>
            {hours.map(({ timeText, time }, index) => {
                return (
                    <React.Fragment key={time}>
                        {time === end ? null : (
                            <Text
                                key={`timeLabel${time}`}  // 時間ラベルのキー
                                style={[styles.timeLabel, { top: 100 * index - 7.5, fontFamily: "NotoSansJP_400Regular" }]}
                            >
                                {timeText}
                            </Text>
                        )}
                        <View
                            key={`line${time}`} // 時間ごとのラインのキー
                            style={[styles.line, { top: 100 * index, width: screenWidth - 36, left: 36 }]} // ラインの位置と幅
                        />
                        {time === end ? null : (
                            <View
                                key={`lineHalf${time}`} // 各時間の半分の位置にラインを引くためのキー
                                style={[styles.line, { top: 100 * (index + 0.5), width: screenWidth - 36, left: 36 }]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
            <View style={[styles.verticalLine, { left: 50 }]} />
        </>
    );
};

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
    screenWidth: number;
}

export const NowIndicator = React.memo(({ screenWidth }: NowIndicatorProps): JSX.Element => {

    const indicatorPosition = calcTimeOffset(100);

    const nowIndicatorStyle = useMemo(() => {
        return [styles.nowIndicator, {top: indicatorPosition}];
    }, [indicatorPosition]);

    return(
        <View style={nowIndicatorStyle}>
            <View style={[styles.nowIndicatorLine, { width: screenWidth - 50 }]}/>
            <View style={styles.nowIndicatorKnob}/>
        </View>
    );
});

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
                        start={0}
                        end={24}
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

/**
 * タイムラインリストを表示するためのスクロール可能なコンポーネント。
 *
 * `TimelineList` コンポーネントは、タイムラインの内容をスクロール可能なリストとして
 * 包み込むためのコンポーネントです。ここに追加の項目やタイムラインに関連するコンテンツを
 * 加えることができます。
 *
 * @returns {JSX.Element} スクロールビューでラップされたタイムラインリスト。
 */
export const TimelineList = (): JSX.Element => {
    return (
        <View style={styles.timelineList}>
            <ScrollView>
            </ScrollView>
        </View>
    );
};

// コンポーネント用のスタイル
const styles = StyleSheet.create({
    hours: {
        backgroundColor: "white", // 背景色を白に設定
        display: "flex", // フレックスボックスを使用
        width: 375, // 固定幅
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
    timeline: {
        backgroundColor: "white",
        display: "flex",
        height: 2400 // タイムラインの高さ（画面全体を超える高さに設定）
    },
    timelineContainer: {
        display: "flex"
    },
    timelineList: {
        flex: 1, // リストが画面全体を占めるようにする
    },
});
