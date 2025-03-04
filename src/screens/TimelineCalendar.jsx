import React, { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import {
    ExpandableCalendar,
    TimelineList,
    CalendarProvider,
    CalendarUtils
} from 'react-native-calendars';
import { groupBy, filter, find } from 'lodash';
import { timelineEvents, getDate } from '../mocks/timelineEvents';

const INITIAL_TIME = { hour: 9, minutes: 0 };
const EVENTS = timelineEvents;

const TimelineCalendarScreen = () => {
    // 状態管理のための useState フック
    const [currentDate, setCurrentDate] = useState(getDate());
    const [eventsByDate, setEventsByDate] = useState(
        groupBy(EVENTS, (e) => CalendarUtils.getCalendarDateString(e.start))
    );

    const marked = {
        [`${getDate(-1)}`]: { marked: true },
        [`${getDate()}`]: { marked: true },
        [`${getDate(1)}`]: { marked: true },
        [`${getDate(2)}`]: { marked: true },
        [`${getDate(4)}`]: { marked: true }
    };

    // 日付変更時の処理
    const onDateChanged = useCallback((date, source) => {
        console.log('TimelineCalendarScreen onDateChanged: ', date, source);
        setCurrentDate(date);
    }, []);

    // 月変更時の処理
    const onMonthChange = useCallback((month, updateSource) => {
        console.log('TimelineCalendarScreen onMonthChange: ', month, updateSource);
    }, []);

    // 新しいイベントを作成する処理
    const createNewEvent = (timeString, timeObject) => {
        const hourString = `${(timeObject.hour + 1).toString().padStart(2, '0')}`;
        const minutesString = `${timeObject.minutes.toString().padStart(2, '0')}`;

        const newEvent = {
        id: 'draft',
        start: `${timeString}`,
        end: `${timeObject.date} ${hourString}:${minutesString}:00`,
        title: 'New Event',
        color: 'white'
        };

        setEventsByDate((prevEventsByDate) => {
        const updatedEvents = { ...prevEventsByDate };
        if (timeObject.date) {
            if (updatedEvents[timeObject.date]) {
            updatedEvents[timeObject.date] = [...updatedEvents[timeObject.date], newEvent];
            } else {
            updatedEvents[timeObject.date] = [newEvent];
            }
        }
        return updatedEvents;
        });
    };

    // イベントの作成を承認する処理
    const approveNewEvent = (_timeString, timeObject) => {
        Alert.prompt('New Event', 'Enter event title', [
        {
            text: 'Cancel',
            onPress: () => {
            setEventsByDate((prevEventsByDate) => {
                const updatedEvents = { ...prevEventsByDate };
                if (timeObject.date) {
                updatedEvents[timeObject.date] = filter(updatedEvents[timeObject.date], (e) => e.id !== 'draft');
                }
                return updatedEvents;
            });
            }
        },
        {
            text: 'Create',
            onPress: (eventTitle) => {
            setEventsByDate((prevEventsByDate) => {
                const updatedEvents = { ...prevEventsByDate };
                if (timeObject.date) {
                const draftEvent = find(updatedEvents[timeObject.date], { id: 'draft' });
                if (draftEvent) {
                    draftEvent.id = undefined;
                    draftEvent.title = eventTitle ?? 'New Event';
                    draftEvent.color = 'lightgreen';
                    updatedEvents[timeObject.date] = [...updatedEvents[timeObject.date]];
                }
                }
                return updatedEvents;
            });
            }
        }
        ]);
    };

    // タイムラインのプロパティ設定
    const timelineProps = {
        format24h: true,
        onBackgroundLongPress: createNewEvent,
        onBackgroundLongPressOut: approveNewEvent,
        unavailableHours: [{ start: 0, end: 6 }, { start: 22, end: 24 }],
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24
    };

    return (
        <CalendarProvider
            date={currentDate}
            onDateChanged={onDateChanged}
            onMonthChange={onMonthChange}
            showTodayButton
            disabledOpacity={0.6}
        >
        <ExpandableCalendar
            firstDay={1}
            leftArrowImageSource={require('../img/previous.png')}
            rightArrowImageSource={require('../img/next.png')}
            markedDates={marked}
        />
        <TimelineList
            events={eventsByDate}
            timelineProps={timelineProps}
            showNowIndicator
            scrollToFirst
            initialTime={INITIAL_TIME}
        />
        </CalendarProvider>
    );
};

export default TimelineCalendarScreen;
