import XDate from 'xdate';
import React, {useCallback, useMemo} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

/**
 * イベント情報を格納するインターフェース。
 *
 * @interface Event
 */
export interface Event {
    /**
     * イベントのオプショナルな識別子。
     *
     * @type {string}
     * @optional
     */
    id?: string;

    /**
     * イベントの開始時間。
     *
     * @type {string}
     */
    start: string;

    /**
     * イベントの終了時間。
     *
     * @type {string}
     */
    end: string;

    /**
     * イベントのタイトル。
     *
     * @type {string}
     */
    title: string;

    /**
     * イベントのオプショナルなサマリーや説明。
     *
     * @type {string}
     * @optional
     */
    summary?: string;

    /**
     * イベントのオプショナルな色。
     *
     * @type {string}
     * @optional
     */
    color?: string;
}

/**
 * PackedEventは、イベントに位置とサイズ情報を追加した拡張版のEventです。
 *
 * @interface PackedEvent
 * @extends Event
 */
export interface PackedEvent extends Event {
    /**
     * イベントのインデックス（参照用）。
     *
     * @type {number}
     */
    index: number;

    /**
     * イベントの左端の位置（コンテナ内での相対位置）。
     *
     * @type {number}
     */
    left: number;

    /**
     * イベントの上端の位置（コンテナ内での相対位置）。
     *
     * @type {number}
     */
    top: number;

    /**
     * イベントブロックの幅。
     *
     * @type {number}
     */
    width: number;

    /**
     * イベントブロックの高さ。
     *
     * @type {number}
     */
    height: number;
}

/**
 * EventBlockコンポーネントのプロパティを定義するインターフェース。
 *
 * @interface EventBlockProps
 */
export interface EventBlockProps {
    /**
     * イベントのインデックス（親コンポーネントから渡される）。
     *
     * @type {number}
     */
    index: number;

    /**
     * PackedEvent形式のイベントデータ（位置とサイズ情報を含む）。
     *
     * @type {PackedEvent}
     */
    event: PackedEvent;

    /**
     * イベントがタップされたときに呼び出される関数。
     *
     * @param {number} eventIndex イベントのインデックス
     * @returns {void}
     */
    onPress: (eventIndex: number) => void;

    /**
     * イベントをカスタムレンダリングするオプションの関数。
     * 指定しない場合、デフォルトのレンダリングが行われます。
     *
     * @param {PackedEvent} event イベントデータ
     * @returns {JSX.Element} カスタムレンダリングされたJSX要素
     * @optional
     */
    renderEvent?: (event: PackedEvent) => JSX.Element;
}

const TEXT_LINE_HEIGHT = 17;  // イベントブロック内のテキスト行高
const EVENT_DEFAULT_COLOR = '#add8e6';  // デフォルトのイベント色

/**
 * イベントブロックを表示するコンポーネント。
 * イベントのタイトル、サマリー、時間などを表示するためのUI要素を提供します。
 *
 * @param {EventBlockProps} props コンポーネントのプロパティ
 * @returns {JSX.Element} イベントブロックをレンダリングするJSX要素
 */
const EventBlock = (props: EventBlockProps) => {
    const {index, event, renderEvent, onPress} = props;

    // イベントブロックの高さに基づき表示する行数を計算
    const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);
    const formatTime = 'HH:mm';  // 時間のフォーマット

    // メモ化して、イベントのスタイルを計算
    const eventStyle = useMemo(() => {
        return {
            left: event.left,  // イベントの左位置
            height: event.height,  // イベントの高さ
            width: event.width,  // イベントの幅
            top: event.top,  // イベントの上位置
            backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR  // イベントの背景色
        };
    }, [event]);

    // イベントがタップされた時の処理
    const _onPress = useCallback(() => {
        onPress(index);  // タップされたイベントのインデックスを親に通知
    }, [index, onPress]);

    return (
        <TouchableOpacity activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
            {/* renderEventが提供されていれば、それを使ってイベントをカスタムレンダリング */}
            {renderEvent ? (
                renderEvent(event)
            ) : (
                <View>
                    {/* イベントのタイトル */}
                    <Text numberOfLines={1} style={styles.eventTitle}>
                        {event.title || 'イベント'}  {/* タイトルが空ならデフォルトで「イベント」 */}
                    </Text>
                    {/* 複数行のサマリー */}
                    {numberOfLines > 1 ? (
                        <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
                            {event.summary || ' '}  {/* サマリーが空なら空白を表示 */}
                        </Text>
                    ) : null}
                    {/* 開始時刻と終了時刻 */}
                    {numberOfLines > 2 ? (
                        <Text style={styles.eventTimes} numberOfLines={1}>
                            {/* XDateを使って時間をフォーマット */}
                            {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
                        </Text>
                    ) : null}
                </View>
            )}
        </TouchableOpacity>
    );
};

export default EventBlock;

/**
 * EventBlockのスタイル設定。
 *
 * @constant styles
 */
const styles = StyleSheet.create({
    event: {
        opacity: 1,  // イベントの透明度
        paddingLeft: 4,  // 左側のパディング
        paddingTop: 5,  // 上側のパディング
        paddingBottom: 0,  // 下側のパディング
        backgroundColor: '#F0F4FF',  // 背景色
        borderColor: '#DDE5FD',  // ボーダーの色
        borderWidth: 1,  // ボーダー幅
        position: 'absolute',  // 絶対位置で配置
        flex: 1,  // コンテナ内での幅の利用
        flexDirection: 'column',  // 縦方向に要素を並べる
        alignItems: 'flex-start',  // 左寄せ
        overflow: 'hidden',  // 内容がはみ出さないようにする
        minHeight: 25  // 最小高さ
    },
    eventTitle: {
        color: "black",  // タイトルの色
        fontWeight: '600',  // 太字
        minHeight: 15  // 最小高さ
    },
    eventSummary: {
        color: "black",  // サマリーの色
        fontSize: 12,  // フォントサイズ
        flexWrap: 'wrap'  // テキストの折り返し
    },
    eventTimes: {
        marginTop: 3,  // 上に余白
        color: "red",  // 時間のテキストカラー
        fontSize: 10,  // フォントサイズ
        fontWeight: 'bold',  // 太字
        flexWrap: 'wrap'  // テキストの折り返し
    },
});
