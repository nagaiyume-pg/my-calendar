import React, {useMemo} from 'react';
import {View, TextStyle, ViewStyle, StyleSheet} from 'react-native';

/**
 * 現在時刻を表示するインジケーターのプロパティを定義するインターフェース。
 *
 * @interface NowIndicatorProps
 */
export interface NowIndicatorProps {
    /**
     * インジケーターの幅。
     *
     * @type {number}
     */
    width: number;

    /**
     * インジケーターの左位置（横位置）。
     *
     * @type {number}
     */
    // TODO:leftを削除する
    left: number;

    /**
     * 1時間の高さ（時間軸の高さ）。
     *
     * @type {number}
     */
    hourHeight: number;
}

/**
 * 現在時刻を表示するインジケーターコンポーネント。
 * 時間軸の上で現在時刻の位置を示すインジケーターを表示します。
 *
 * @param {NowIndicatorProps} props コンポーネントのプロパティ
 * @returns {JSX.Element} 現在時刻を示すインジケーターをレンダリングするJSX要素
 */
const NowIndicator = (props: NowIndicatorProps) => {
    const {left, hourHeight, width} = props;

    /**
     * 時間ブロックの高さとオプションの時間、分を元に、現在の時刻に対応する位置（オフセット）を計算する関数。
     *
     * @param {number} hourBlockHeight 1時間の高さ
     * @param {number} [hour] 現在時刻の時（オプション）
     * @param {number} [minutes] 現在時刻の分（オプション）
     * @returns {number} 時間軸における現在時刻の位置（ピクセル単位）
     */
    function calcTimeOffset(hourBlockHeight: number, hour?: number, minutes?: number) {
        const now = new Date();  // 現在時刻を取得
        const h = hour ?? now.getHours();  // 時間（引数がなければ現在の時刻）
        const m = minutes ?? now.getMinutes();  // 分（引数がなければ現在の時刻）
        return (h + m / 60) * hourBlockHeight;  // 時間に基づく位置の計算
    }

    // 現在時刻に対応する位置（インジケーターの位置）を計算
    const indicatorPosition = calcTimeOffset(hourHeight);

    // インジケーターのスタイルをメモ化して最適化
    const nowIndicatorStyle = useMemo(() => {
        return [styles.nowIndicator, {top: indicatorPosition, left: left}];
    }, [indicatorPosition, left]);

    return (
        <View style={nowIndicatorStyle}>
            {/* 現在時刻を示す縦のライン */}
            <View style={[styles.nowIndicatorLine, {width: width}]}/>
            {/* 現在時刻を示すノブ（つまみ） */}
            <View style={styles.nowIndicatorKnob}/>
        </View>
    );
};

export default NowIndicator;

const styles = StyleSheet.create({
    nowIndicator: {
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
