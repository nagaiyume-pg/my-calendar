import range from 'lodash/range';
import times from 'lodash/times';

import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, TouchableWithoutFeedback, ViewStyle, TextStyle, StyleSheet } from 'react-native';

import constants from '../commons/constants';
import { buildTimeString, calcTimeByPosition, calcDateByPosition } from './helpers/presenter';
import { buildUnavailableHoursBlocks, HOUR_BLOCK_HEIGHT, UnavailableHours } from './Packer';

// イベントの時間に関するインターフェース定義
interface NewEventTime {
  hour: number;  // 時間（0〜23）
  minutes: number;  // 分（0〜59）
  date?: string;  // 日付（オプション）
}

// TimelineHoursコンポーネントのプロパティインターフェース
export interface TimelineHoursProps {
  start?: number;  // タイムラインの開始時間
  end?: number;  // タイムラインの終了時間
  date?: string;  // タイムラインの日付
  format24h?: boolean;  // 24時間形式かどうか
  onBackgroundLongPress?: (timeString: string, time: NewEventTime) => void;  // 背景を長押しした時の処理
  onBackgroundLongPressOut?: (timeString: string, time: NewEventTime) => void;  // 長押しを離した時の処理
  unavailableHours?: UnavailableHours[];  // 利用不可時間のブロック
  unavailableHoursColor?: string;  // 利用不可時間の色
  styles: { [key: string]: ViewStyle | TextStyle };  // 各要素のスタイル
  width: number;  // タイムラインの幅
  numberOfDays: number;  // 表示する日数
  timelineLeftInset?: number;  // タイムラインの左側のインセット（オプション）
  testID?: string;  // テスト用のID（オプション）
}

const dimensionWidth = constants.screenWidth;  // 画面幅の定数
const EVENT_DIFF = 20;  // イベントアイテムの横幅に追加するスペース

// TimelineHoursコンポーネント
const TimelineHours = (props: TimelineHoursProps) => {
  const {
    format24h,
    start = 0,
    end = 24,
    date,
    unavailableHours,
    unavailableHoursColor,
    styles,
    onBackgroundLongPress,
    onBackgroundLongPressOut,
    width,
    numberOfDays = 1,
    timelineLeftInset = 0,
    testID
  } = props;

  // 最後に長押しされた時間を保持するための参照
  const lastLongPressEventTime = useRef<NewEventTime>();

  const offset = HOUR_BLOCK_HEIGHT;  // 各時間ブロックの高さ
  const unavailableHoursBlocks = buildUnavailableHoursBlocks(unavailableHours, { dayStart: start, dayEnd: end });

  // 各時間のラベル（例えば、'1:00 AM'など）をメモ化して最適化
  const hours = useMemo(() => {
    return range(start, end + 1).map(i => {
      let timeText;

      // 時間の表示形式を24時間形式または12時間形式に基づいて設定
      if (i === start) {
        timeText = '';  // 開始時間が0の場合は表示しない
      } else if (i < 12) {
        timeText = !format24h ? `${i} AM` : `${i}:00`;  // 12時間形式
      } else if (i === 12) {
        timeText = !format24h ? `${i} PM` : `${i}:00`;  // 正午
      } else if (i === 24) {
        timeText = !format24h ? '12 AM' : '23:59';  // 深夜
      } else {
        timeText = !format24h ? `${i - 12} PM` : `${i}:00`;  // 12時間形式のPM
      }

      return { timeText, time: i };  // 表示用の時間と実際の時間を返す
    });
  }, [start, end, format24h]);

  // 背景を長押しした時の処理
  const handleBackgroundPress = useCallback(
    event => {
      const yPosition = event.nativeEvent.locationY;  // Y座標を取得
      const xPosition = event.nativeEvent.locationX;  // X座標を取得

      // Y座標から時間を計算
      const { hour, minutes } = calcTimeByPosition(yPosition, HOUR_BLOCK_HEIGHT);

      // X座標から日付を計算
      const dateByPosition = calcDateByPosition(xPosition, timelineLeftInset, numberOfDays, date);

      // 長押しされた時間と日付を保存
      lastLongPressEventTime.current = { hour, minutes, date: dateByPosition };

      const timeString = buildTimeString(hour, minutes, dateByPosition);  // 時間を文字列に変換
      onBackgroundLongPress?.(timeString, lastLongPressEventTime.current);  // 長押しイベントを親コンポーネントに通知
    },
    [onBackgroundLongPress, date]
  );

  // 長押しを離した時の処理
  const handlePressOut = useCallback(() => {
    if (lastLongPressEventTime.current) {
      const { hour, minutes, date } = lastLongPressEventTime.current;
      const timeString = buildTimeString(hour, minutes, date);
      onBackgroundLongPressOut?.(timeString, lastLongPressEventTime.current);  // 長押し解除イベントを親コンポーネントに通知
      lastLongPressEventTime.current = undefined;  // 最後の長押し時間をリセット
    }
  }, [onBackgroundLongPressOut, date]);

  return (
    <>
      {/* タイムラインの背景を長押しするための透明なビュー */}
      <TouchableWithoutFeedback onLongPress={handleBackgroundPress} onPressOut={handlePressOut}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>

      {/* 利用不可時間のブロックを描画 */}
      {unavailableHoursBlocks.map((block, index) => (
        <View
          key={index}
          style={[
            styles.unavailableHoursBlock,  // 利用不可時間のブロックスタイル
            block,  // ブロックの位置とサイズ
            unavailableHoursColor ? { backgroundColor: unavailableHoursColor } : undefined,  // 色指定があれば設定
            { left: timelineLeftInset }
          ]}
        />
      ))}

      {/* 各時間のラベルとラインを描画 */}
      {hours.map(({ timeText, time }, index) => {
        return (
          <React.Fragment key={time}>
            {/* 時間のラベル */}
            <Text
              key={`timeLabel${time}`}
              style={[styles.timeLabel, { top: offset * index - 6, width: timelineLeftInset - 16 }]}
            >
              {timeText}
            </Text>

            {/* 時間を示すライン（開始時間を除く） */}
            {time === start ? null : (
              <View
                key={`line${time}`}
                testID={`${testID}.${time}.line`}
                style={[styles.line, { top: offset * index, width: dimensionWidth - EVENT_DIFF, left: timelineLeftInset - 16 }]}
              />
            )}

            {/* 時間の半分を示すライン */}
            <View
              key={`lineHalf${time}`}
              testID={`${testID}.${time}.lineHalf`}
              style={[styles.line, { top: offset * (index + 0.5), width: dimensionWidth - EVENT_DIFF, left: timelineLeftInset - 16 }]}
            />
          </React.Fragment>
        );
      })}

      {/* 複数日を表示するための縦線 */}
      {times(numberOfDays, (index) => (
        <View key={index} style={[styles.verticalLine, { right: (index + 1) * width / numberOfDays }]} />
      ))}
    </>
  );
};

export default React.memo(TimelineHours);  // メモ化して再描画の無駄を減らす
