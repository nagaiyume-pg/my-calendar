import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import range from 'lodash/range';
import {
    useFonts,
    NotoSansJP_400Regular
} from '@expo-google-fonts/noto-sans-jp';
import * as SplashScreen from 'expo-splash-screen';

// 自動的なスプラッシュ画面の非表示を防ぐ
SplashScreen.preventAutoHideAsync();

/**
 * `Hours` コンポーネントのプロパティ型。
 *
 * `screenWidth` はタイムライン全体の幅を指定するために使用され、レイアウト調整に利用されます。
 * `timelinePaddingLeft` は、タイムラインの縦ラインの配置を調整するために、左側の余白を指定します。
 *
 * @interface HoursProps
 */
interface HoursProps {
    screenWidth: number; // 画面幅（レイアウト調整に使用）
}

/**
 * 1日分の時間のタイムラインを表示するコンポーネント。
 *
 * `Hours` コンポーネントは0時から24時までの時間を1時間ごとに表示します。
 * 各時間の間にラインを引き、スクロールできる形で表示されます。
 * 例えば、イベントやスケジュールのインターフェースで利用されることが想定されます。
 *
 * @param {HoursProps} props - 画面幅と縦ラインの配置の調整に使用されるプロパティ
 * @returns {JSX.Element} 時間ごとのタイムラインを描画したコンポーネント
 */
export const Hours = React.memo(({ screenWidth }: HoursProps): JSX.Element => {
    // フォントの読み込み状態を管理
    const [fontsLoaded] = useFonts({
        NotoSansJP_400Regular, // 日本語フォントを読み込み
    });

    const start = 0; // タイムラインの開始時刻（0時）
    const end = 24; // タイムラインの終了時刻（24時）

    // 時間を0時から24時までリストとして生成
    const hours = useMemo(() => {
        return range(start, end + 1).map(i => {
            let timeText;

            // 時間をフォーマットして、表示用の文字列を生成
            if (i === start) {
                timeText = ''; // 0時のラベルは表示しない
            } else if (i < 10) {
                timeText = `0${i}:00`; // 01:00 形式にする
            } else {
                timeText = `${i}:00`; // 10:00 以降はそのまま
            }
            return { timeText, time: i }; // timeText（表示用）と time（数値）のオブジェクトを返す
        });
    }, [start, end]);

    // フォントが読み込まれるまで、何も表示しない
    if (!fontsLoaded) {
        return (
            <React.Fragment /> // フォントが読み込まれるまで、表示を一時的に停止
        );
    }

    return (
        <>
            {/* 時間ごとにラベルとラインを描画 */}
            {hours.map(({ timeText, time }, index) => {
                return (
                    <React.Fragment key={time}>
                        {time === end ? null : (
                            <Text
                                key={`timeLabel${time}`}  // 各時間ラベルのキー
                                style={[styles.timeLabel, { top: 100 * index - 7.5, fontFamily: "NotoSansJP_400Regular" }]} >
                                {timeText}
                            </Text>
                        )}
                        <View
                            key={`line${time}`} // 各時間ごとのラインのキー
                            style={[styles.line, { top: 100 * index, width: screenWidth - 36, left: 36 }]}/> {/* ラインの位置と幅を設定 */}
                        {time === end ? null : (
                            <View
                                key={`lineHalf${time}`} // 各時間の半分の位置にラインを追加するためのキー
                                style={[styles.line, { top: 100 * (index + 0.5), width: screenWidth - 36, left: 36 }]}/>
                        )}
                    </React.Fragment>
                );
            })}
            {/* タイムラインの縦ラインを描画 */}
            <View style={[styles.verticalLine, { left: 50 }]}/>
        </>
    );
});

const styles = StyleSheet.create({
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
        backgroundColor: 'black', // 縦ラインの色
        height: '100%', // 画面全体の高さ
        position: 'absolute', // 絶対配置
        width: 1, // 縦ラインの幅
    }
})