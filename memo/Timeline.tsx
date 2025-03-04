import min from 'lodash/min';
import map from 'lodash/map';
import times from 'lodash/times';
import groupBy from 'lodash/groupBy';

import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, ScrollView} from 'react-native';

import constants from '../commons/constants';
import {generateDay} from '../dateutils';
import {getCalendarDateString} from '../services';
import {Theme} from '../types';
import styleConstructor from './style';
import {populateEvents, HOUR_BLOCK_HEIGHT, UnavailableHours} from './Packer';
import {calcTimeOffset} from './helpers/presenter';
import TimelineHours, {TimelineHoursProps} from './TimelineHours';
import EventBlock, {Event, PackedEvent} from './EventBlock';
import NowIndicator from './NowIndicator';
import useTimelineOffset from './useTimelineOffset';

/**
 * Timeline コンポーネントのプロパティ。
 */
export interface TimelineProps {
  /**
   * このタイムラインインスタンスの日付を指定します。
   * 日付は文字列または文字列の配列で渡すことができます。
   * 例: '2025-03-04' または ['2025-03-04', '2025-03-05']
   */
  date?: string | string[];

  /**
   * タイムラインに表示するイベントのリスト。
   * `Event` 型の配列で、各イベントは開始時刻や終了時刻を含んでいます。
   */
  events: Event[];

  /**
   * タイムラインの開始時刻（0〜23 時間形式）。デフォルトは 0。
   */
  start?: number;

  /**
   * タイムラインの終了時刻（0〜23 時間形式）。デフォルトは 24。
   */
  end?: number;

  /**
   * @deprecated
   * `onEventPress` を代わりに使用してください。
   * イベントがタップされたときに呼ばれるコールバック関数。
   */
  eventTapped?: (event: Event) => void;

  /**
   * イベントがタップされたときに呼ばれるコールバック関数。
   * `Event` オブジェクトが渡されます。
   */
  onEventPress?: (event: Event) => void;

  /**
   * タイムラインの背景で長押ししたときに新しいイベントを作成するためのコールバック関数。
   * 長押しされた位置の時刻と日付が返されます。
   * `onBackgroundLongPressOut` も合わせて使用することができます。
   */
  onBackgroundLongPress?: TimelineHoursProps['onBackgroundLongPress'];

  /**
   * タイムラインの背景で長押し解除したときに呼ばれるコールバック関数。
   * 長押しが解除された位置の時刻と日付が返されます。
   */
  onBackgroundLongPressOut?: TimelineHoursProps['onBackgroundLongPressOut'];

  /**
   * コンポーネントに渡すテーマ設定。`Theme` 型でスタイルをカスタマイズできます。
   */
  styles?: Theme;

  /**
   * タイムラインのテーマの上書き設定。
   */
  theme?: Theme;

  /**
   * イベントリストが読み込まれた後に最初のイベントまでスクロールするかどうかを指定します。
   */
  scrollToFirst?: boolean;

  /**
   * 現在時刻にスクロールするかどうかを指定します。
   */
  scrollToNow?: boolean;

  /**
   * 初期スクロール位置を設定するための時刻（時間と分）。
   * 例: `{hour: 9, minutes: 30}` のように指定します。
   */
  initialTime?: {hour: number; minutes: number};

  /**
   * 24時間形式で時間を表示するかどうかを指定します。デフォルトは `true`。
   */
  format24h?: boolean;

  /**
   * カスタムイベントブロックをレンダリングするための関数。
   * これを指定することで、デフォルトの `EventBlock` コンポーネントではなく、独自のイベントブロックを描画できます。
   */
  renderEvent?: (event: PackedEvent) => JSX.Element;

  /**
   * 現在時刻を示すインジケーターを表示するかどうかを指定します。
   * 現在時刻の位置を表示するために使用されます。
   */
  showNowIndicator?: boolean;

  /**
   * タイムラインのスクロール位置に関連するオフセット値を指定します。
   * スクロール位置を外部で管理する場合に使用されます。
   */
  scrollOffset?: number;

  /**
   * タイムラインコンポーネントがスクロールされるたびに呼ばれるコールバック関数。
   * `offset` は現在のスクロール位置（y座標）です。
   */
  onChangeOffset?: (offset: number) => void;

  /**
   * 重なり合うイベントがある場合、その間隔を指定します。
   * イベントが重ならないように配置します。
   */
  overlapEventsSpacing?: number;

  /**
   * 背景の長押し時の右端の余白を指定します。
   * これを使って背景長押しで作成するイベントの位置を調整できます。
   */
  rightEdgeSpacing?: number;

  /**
   * 利用できない時間帯のリスト。
   * 利用できない時間帯を背景色などで表示するために使用します。
   */
  unavailableHours?: UnavailableHours[];

  /**
   * 利用できない時間帯の背景色を指定します。
   */
  unavailableHoursColor?: string;

  /**
   * タイムラインに表示する日数を指定します。デフォルトは1日。
   * 複数の日を表示する場合、この値を変更します。
   */
  numberOfDays?: number;

  /**
   * タイムラインカレンダーの左端のインセット（サイドバーの幅）を指定します。
   * デフォルトは72px（サイドバーの幅）。
   */
  timelineLeftInset?: number;

  /**
   * テスト用の識別子。
   * テストツールやエンドツーエンドテストに使用されます。
   */
  testID?: string;
}

/**
 * タイムラインコンポーネント
 * タイムライン表示、イベント表示、スクロール機能などを管理します。
 */
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

  // 日付を文字列または文字列配列からページごとの日付に変換
  const pageDates = useMemo(() => {
    return typeof date === 'string' ? [date] : date;
  }, [date]);

  // イベントを日付ごとにグループ化する
  const groupedEvents = useMemo(() => {
    return groupBy(events, e => getCalendarDateString(e.start));
  }, [events]);

  // 各ページの日付に対応するイベントのリストを作成
  const pageEvents = useMemo(() => {
    return map(pageDates, d => groupedEvents[d] || []);
  }, [pageDates, groupedEvents]);

  const scrollView = useRef<ScrollView>();
  const calendarHeight = useRef((end - start) * HOUR_BLOCK_HEIGHT);
  const styles = useRef(styleConstructor(theme || props.styles, calendarHeight.current));

  // スクロール位置の変更を管理するフックを使用
  const {scrollEvents} = useTimelineOffset({onChangeOffset, scrollOffset, scrollViewRef: scrollView});

  // タイムラインの幅を計算
  const width = useMemo(() => {
    return constants.screenWidth - timelineLeftInset;
  }, [timelineLeftInset]);

  // イベントのパック処理：イベントを画面上に配置するための情報を追加
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

  // 初期スクロール位置を設定
  useEffect(() => {
    let initialPosition = 0;
    if (scrollToNow) {
      // 現在時刻にスクロール
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT);
    } else if (scrollToFirst && packedEvents[0].length > 0) {
      // 最初のイベントまでスクロール
      initialPosition = min(map(packedEvents[0], 'top')) ?? 0;
    } else if (initialTime) {
      // 指定した初期時刻にスクロール
      initialPosition = calcTimeOffset(HOUR_BLOCK_HEIGHT, initialTime.hour, initialTime.minutes);
    }

    // スクロール位置を設定
    if (initialPosition) {
      setTimeout(() => {
        scrollView?.current?.scrollTo({
          y: Math.max(0, initialPosition - HOUR_BLOCK_HEIGHT),
          animated: true
        });
      }, 0);
    }
  }, []);

  // イベントがタップされたときに呼ばれる処理
  const _onEventPress = useCallback(
    (dateIndex: number, eventIndex: number) => {
      const event = packedEvents[dateIndex][eventIndex];
      if (eventTapped) {
        // 非推奨：古い `eventTapped` を使用
        eventTapped(event);
      } else {
        // 新しい `onEventPress` を使用
        onEventPress?.(event);
      }
    },
    [onEventPress, eventTapped]
  );

  // イベントを表示するためのコンポーネントを作成
  const renderEvents = (dayIndex: number) => {
    const events = packedEvents[dayIndex].map((event: PackedEvent, eventIndex: number) => {
      const onEventPress = () => _onEventPress(dayIndex, eventIndex);
      return (
        <EventBlock
          key={eventIndex}
          index={eventIndex}
          event={event}
          styles={styles.current}
          format24h={format24h}
          onPress={onEventPress}
          renderEvent={renderEvent}
          testID={`${testID}.event.${event.id}`}
        />
      );
    });

    return (
      <View pointerEvents={'box-none'}  style={[{marginLeft: dayIndex === 0 ? timelineLeftInset : undefined}, styles.current.eventsContainer]}>
        {events}
      </View>
    );
  };

  // 各日のタイムラインをレンダリング
  const renderTimelineDay = (dayIndex: number) => {
    const indexOfToday = pageDates.indexOf(generateDay(new Date().toString()));
    const left = timelineLeftInset + indexOfToday * width / numberOfDays;
    return (
      <React.Fragment key={dayIndex}>
        {renderEvents(dayIndex)}
        {indexOfToday !== -1 && showNowIndicator && <NowIndicator width={width / numberOfDays} left={left} styles={styles.current}/>}
      </React.Fragment>
    );
  };

  // タイムライン全体のレンダリング
  return (
    <ScrollView
      // @ts-expect-error
      ref={scrollView}
      style={styles.current.container}
      contentContainerStyle={[styles.current.contentStyle, {width: constants.screenWidth}]}
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
      {times(numberOfDays, renderTimelineDay)}
    </ScrollView>
  );
};

export {Event as TimelineEventProps, PackedEvent as TimelinePackedEventProps};
export default React.memo(Timeline);
