import XDate from 'xdate';
import React, { useCallback, useMemo } from 'react';
import { View, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

// イベントの型定義
export interface Event {
  id?: string;  // イベントのID
  start: string;  // イベントの開始時刻
  end: string;  // イベントの終了時刻
  title: string;  // イベントのタイトル
  summary?: string;  // イベントの概要（オプション）
  color?: string;  // イベントの色（オプション）
}

// PackedEventはEventを拡張した型で、イベントの位置やサイズ情報も持つ
export interface PackedEvent extends Event {
  index: number;  // イベントのインデックス
  left: number;  // イベントの左端の位置
  top: number;  // イベントの上端の位置
  width: number;  // イベントの幅
  height: number;  // イベントの高さ
}

// EventBlockコンポーネントのプロパティの型定義
export interface EventBlockProps {
  index: number;  // イベントのインデックス
  event: PackedEvent;  // 表示するイベント
  onPress: (eventIndex: number) => void;  // イベントがタップされたときの処理
  renderEvent?: (event: PackedEvent) => JSX.Element;  // カスタムイベントのレンダリング関数（オプション）
  format24h?: boolean;  // 24時間形式で表示するかどうか
  styles: { [key: string]: ViewStyle | TextStyle };  // スタイルのオブジェクト
  testID?: string;  // テストID（オプション）
}

const TEXT_LINE_HEIGHT = 17;  // テキストの行の高さ
const EVENT_DEFAULT_COLOR = '#add8e6';  // デフォルトのイベントの色（ライトブルー）

const EventBlock = (props: EventBlockProps) => {
  const { index, event, renderEvent, onPress, format24h, styles } = props;

  // イベントタイトルが複数行に渡る可能性があるため、表示する行数を計算
  const numberOfLines = Math.floor(event.height / TEXT_LINE_HEIGHT);  // 高さに基づいて表示する行数を決定
  const formatTime = format24h ? 'HH:mm' : 'hh:mm A';  // 時間のフォーマットを選択（24時間または12時間）

  // イベントのスタイル（位置や大きさ、背景色）を計算
  const eventStyle = useMemo(() => {
    return {
      left: event.left,  // 左位置
      height: event.height,  // 高さ
      width: event.width,  // 幅
      top: event.top,  // 上位置
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR  // 色（指定されていなければデフォルトの色）
    };
  }, [event]);

  // イベントがタップされたときの処理
  const _onPress = useCallback(() => {
    onPress(index);  // 親コンポーネントにインデックスを渡してイベントを処理
  }, [index, onPress]);

  return (
    <TouchableOpacity testID={props.testID} activeOpacity={0.9} onPress={_onPress} style={[styles.event, eventStyle]}>
      {renderEvent ? (
        // renderEventが指定されていれば、それをレンダリング
        renderEvent(event)
      ) : (
        <View>
          {/* イベントタイトル */}
          <Text numberOfLines={1} style={styles.eventTitle}>
            {event.title || 'Event'}  {/* タイトルがなければ'Event'を表示 */}
          </Text>

          {/* イベント概要（複数行表示） */}
          {numberOfLines > 1 ? (
            <Text numberOfLines={numberOfLines - 1} style={[styles.eventSummary]}>
              {event.summary || ' '}  {/* 概要がない場合は空白を表示 */}
            </Text>
          ) : null}

          {/* イベントの時間（複数行表示になる場合も） */}
          {numberOfLines > 2 ? (
            <Text style={styles.eventTimes} numberOfLines={1}>
              {new XDate(event.start).toString(formatTime)} - {new XDate(event.end).toString(formatTime)}
              {/* 開始時刻と終了時刻を指定されたフォーマットで表示 */}
            </Text>
          ) : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default EventBlock;
