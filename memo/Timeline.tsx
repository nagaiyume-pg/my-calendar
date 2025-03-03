import min from 'lodash/min';
import map from 'lodash/map';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, ScrollView } from 'react-native';

import constants from '../commons/constants';
import { generateDay } from '../dateutils';
import { getCalendarDateString } from '../services';
import { Theme } from '../types';
import styleConstructor from './style';
import { populateEvents, HOUR_BLOCK_HEIGHT, UnavailableHours } from './Packer';
import { calcTimeOffset } from './helpers/presenter';
import TimelineHours, { TimelineHoursProps } from './TimelineHours';
import EventBlock, { Event, PackedEvent } from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';

// Timelineコンポーネントのプロパティの型定義
export interface TimelineProps {
  date?: string | string[];  // タイムラインの日付（ISO形式）
  events: Event[];  // タイムラインに表示するイベントのリスト
  start?: number;  // タイムラインの開始時間
  end?: number;  // タイムラインの終了時間
  eventTapped?: (event: Event) => void;  // イベントがタップされたときの処理（非推奨）
  onEventPress?: (event: Event) => void;  // イベントがタップされたときの処理
  onBackgroundLongPress?: TimelineHoursProps['onBackgroundLongPress'];  // 背景を長押ししたときの処理
  onBackgroundLongPressOut?: TimelineHoursProps['onBackgroundLongPressOut'];  // 背景長押し解除時の処理
  styles?: Theme;  // スタイル（非推奨、'theme'に名前が変更される予定）
  theme?: Theme;  // テーマスタイル
  scrollToFirst?: boolean;  // 最初のイベントにスクロールするか
  scrollToNow?: boolean;  // 現在の時間にスクロールするか
  initialTime?: { hour: number; minutes: number };  // 初期スクロール時間
  format24h?: boolean;  // 24時間形式かどうか
  renderEvent?: (event: PackedEvent) => JSX.Element;  // カスタムイベントブロックをレンダリングする関数
  showNowIndicator?: boolean;  // 現在時刻を示すインジケーターを表示するか
  scrollOffset?: number;  // スクロールオフセットの値
  onChangeOffset?: (offset: number) => void;  // スクロールオフセットの変更をリスンする
  overlapEventsSpacing?: number;  // イベントが重なる場合の間隔
  rightEdgeSpacing?: number;  // 右端に追加するスペース（背景の長押し用）
  unavailableHours?: UnavailableHours[];  // 利用不可時間のリスト
  unavailableHoursColor?: string;  // 利用不可時間の背景色
  numberOfDays?: number;  // タイムラインで表示する日数
  timelineLeftInset?: number;  // タイムラインの左側インセット（サイドバーの幅）
  testID?: string;  // テスト用のID
}

const Timeline = (props: TimelineProps) => {
  const {
    format24h = true,
    start = 0,
    end = 24,
    date = '',
    events,
    onEventPress,
    onBackgroundLongPress,
    onBackgroundLongPressOut,
    renderEvent,
    theme,
    scrollToFirst,
    scrollToNow,
    initialTime,
    showNowIndicator,
    scrollOffset,
    onChangeOffset,
    overlapEventsSpacing = 0,
    rightEdgeSpacing = 0,
    unavailableHours,
    unavailableHoursColor,
    eventTapped,
    numberOfDays = 1,
    timelineLeftInset = 0,
    testID
  } = props;

  // 日付を配列に変換（単一の日付の場合でも配列にする）
  const pageDates = useMemo(() => {
    return typeof date === 'string' ? [date] : date;
  }, [date]);

  // イベントを日付ごとにグループ化
  const groupedEvents = useMemo(() => {
    return groupBy(events, e => getCalendarDateString(e.start));
  }, [events]);

  // 日付ごとに表示するイベントを取得
  const pageEvents = useMemo(() => {
    return map(pageDates, d => groupedEvents[d] || []);
  }, [pageDates, groupedEvents]);

  const scrollView = useRef<ScrollView>();  // スクロールビューの参照
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);  // カレンダーの高さ
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));  // スタイルの設定

  const { scrollEvents } = useTimelineOffset({ onChangeOffset, scrollOffset, scrollViewRef: scrollView });

  const width = useMemo(() => {
    return constants.screenWidth - timelineLeftInset;  // タイムラインの幅を計算
  }, [timelineLeftInset]);

  // イベントをパック（重なりやスペースを考慮して調整）
  const packedEvents = useMemo(() => {
    return map(pageEvents, (_e, i) => {
      return populateEvents(pageEvents[i], {
        screenWidth: width / numberOfDays,
        dayStart: start,
        overlapEventsSpacing: overlapEventsSpacing / numberOfDays,
        rightEdgeSpacing: rightEdgeSpacing / numberOfDays
      });
    });
  }, [pageEvents, start, numberOfDays]);

  useEffect(() => {
    let initialPosition = 0;

    // 現在の時間にスクロールする場合
    if (scrollToNow) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
    }
    // 最初のイベントにスクロールする場合
    else if (scrollToFirst && packedEvents[0].length > 0) {
      initialPosition = min(map(packedEvents[0], 'top')) ?? 0;
    }
    // 初期時間が指定されている場合
    else if (initialTime) {
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
    }

    if (initialPosition) {
      setTimeout(() => {
        scrollView?.current?.scrollTo({
          y: Math.max(0, initialPosition - HOUR_BLOCK_HEIGHT),
          animated: true
        });
      }, 0);
    }
  }, []);  // 初期スクロールの設定

  // イベントがタップされたときの処理
  const _onEventPress = useCallback(
    (dateIndex: number, eventIndex: number) => {
      const event = packedEvents[dateIndex][eventIndex];
      if (eventTapped) {
        eventTapped(event);  // 非推奨: 古い処理
      } else {
        onEventPress?.(event);  // 新しい処理
      }
    },
    [onEventPress, eventTapped]
  );

  // 各日のイベントをレンダリング
  const renderEvents = (dayIndex: number) => {
    const events = packedEvents[dayIndex].map((event: PackedEvent, eventIndex: number) => {
      const onEventPress = () => _onEventPress(dayIndex, eventIndex);  // イベントタップ時の処理
      return (
        <EventBlock
          key={eventIndex}
          index={eventIndex}
          event={event}
          styles={styles.current}
          format24h={format24h}
          onPress={onEventPress}
          renderEvent={renderEvent}
          testID={`${testID}.event.${event.id}`}  // テストID
        />
      );
    });

    return (
      <View pointerEvents={'box-none'}  style={[{ marginLeft: dayIndex === 0 ? timelineLeftInset : undefined }, styles.current.eventsContainer]}>
        {events}
      </View>
    );
  };

  // タイムラインの各日をレンダリング
  const renderTimelineDay = (dayIndex: number) => {
    const indexOfToday = pageDates.indexOf(generateDay(new Date().toString()));  // 今日の日付を探す
    const left = timelineLeftInset + indexOfToday * width / numberOfDays;
    return (
      <React.Fragment key={dayIndex}>
        {renderEvents(dayIndex)}  // 各日のイベントを表示
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator width={width / numberOfDays} left={left} styles={styles.current} />}  // 現在時刻インジケーターを表示
      </React.Fragment>
    );
  };

  return (
    <ScrollView
      ref={scrollView}  // スクロールビューの参照を設定
      style={styles.current.container}
      contentContainerStyle={[styles.current.contentStyle, { width: constants.screenWidth }]}
      showsVerticalScrollIndicator={false}
      {...scrollEvents}
      testID={testID}
    >
      <TimelineHours
        start={start}
        end={end}
        date={pageDates[0]}
        format24h={format24h}
        styles={styles.current}
        unavailableHours={unavailableHours}
        unavailableHoursColor={unavailableHoursColor}
        onBackgroundLongPress={onBackgroundLongPress}
        onBackgroundLongPressOut={onBackgroundLongPressOut}
        width={width}
        numberOfDays={numberOfDays}
        timelineLeftInset={timelineLeftInset}
        testID={`${testID}.hours`}
      />
      {times(numberOfDays, renderTimelineDay)}  {/* 日数分タイムラインをレンダリング */}
    </ScrollView>
  );
};

export { Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps };
export default React.memo(Timeline);
