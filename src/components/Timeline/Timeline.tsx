import React, { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import isUndefined from 'lodash/isUndefined';

import XDate from 'xdate';

import {Event} from './EventBlock';
import Hours from "./Hours";

interface TimelineProps {
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
     * 現在時刻を示すインジケーターを表示するかどうかを指定します。
     * 現在時刻の位置を表示するために使用されます。
     */
    showNowIndicator?: boolean;
    startTime: number;
    endTime: number;
    hourHeight: number;
    dimensionWidth: number;
    verticalLineLeftInset: number;
}

const Timeline = (props: TimelineProps) => {
    const {date, startTime, endTime, hourHeight, dimensionWidth, verticalLineLeftInset} = props;

    const timelineHeight = (endTime - startTime) * hourHeight;

    // 日付を文字列または文字列配列からページごとの日付に変換
    const pageDates = useMemo(() => {
    return typeof date === 'string' ? [date] : date;
    }, [date]);

    function toMarkingFormat(d: XDate) {
        if (!isNaN(d.getTime())) {
            const year = `${d.getFullYear()}`;
            const month = d.getMonth() + 1;
            const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
            const day = d.getDate();
            const doubleDigitDay = day < 10 ? `0${day}` : `${day}`;
            return year + '-' + doubleDigitMonth + '-' + doubleDigitDay;
        }
        return 'Invalid Date';
    }

    function getCalendarDateString(date?: Date | string | number) {
        if (!isUndefined(date)) {
            if (isDate(date) && !isNaN(date.getFullYear())) {
                return date.getFullYear() + '-' + padNumber(date.getMonth() + 1) + '-' + padNumber(date.getDate());
            } else if (isString(date)) {
                // issue with strings and XDate's utc-mode - returns one day before
                return toMarkingFormat(new XDate(date, false));
            } else if (isNumber(date)) {
                return toMarkingFormat(new XDate(date, true));
            }
            throw 'Invalid Date';
        }
    }

    // イベントを日付ごとにグループ化する
    const groupedEvents = useMemo(() => {
        return groupBy(events, e => getCalendarDateString(e.start));
    }, [events]);

    // 各ページの日付に対応するイベントのリストを作成
    const pageEvents = useMemo(() => {
    return map(pageDates, d => groupedEvents[d] || []);
    }, [pageDates, groupedEvents]);

    return(
        <ScrollView
            contentContainerStyle={[styles.timelineContent, { height: timelineHeight }]}
            style={styles.timelineContainer}
        >
            <Hours
                startTime={startTime}
                endTime={endTime}
                dimensionWidth={dimensionWidth}
                hourHeight={hourHeight}
                verticalLineLeftInset={verticalLineLeftInset}
            />
        </ScrollView>
    )
}

export default React.memo(Timeline);

const styles = StyleSheet.create({
    timelineContainer: {
        backgroundColor: "white"
    },
    timelineContent: {
        flexDirection: "row"
    }
})