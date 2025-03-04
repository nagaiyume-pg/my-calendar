import React, { useState, useEffect, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import testIDs from '../testIDs';

const AgendaScreen = () => {
    const [items, setItems] = useState(undefined);

    // イベントを取得する関数
    const loadItems = useCallback((day) => {
        const currentItems = items || {};

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!currentItems[strTime]) {
                    currentItems[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        currentItems[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime,
                        });
                    }
                }
            }

            const newItems = {};
            Object.keys(currentItems).forEach((key) => {
                newItems[key] = currentItems[key];
            });

            setItems(newItems);
        }, 1000);
    }, [items]);

    // 日付を文字列に変換する関数
    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    };

    // タッチしたアイテムを表示するアラート
    const renderItem = (reservation, isFirst) => {
        const fontSize = isFirst ? 16 : 14;
        const color = isFirst ? 'black' : '#43515c';

        return (
            <TouchableOpacity
                testID={testIDs.agenda.ITEM}
                style={[styles.item, { height: reservation.height }]}
                onPress={() => Alert.alert(reservation.name)}
            >
                <Text style={{ fontSize, color }}>{reservation.name}</Text>
            </TouchableOpacity>
        );
    };

    // 空の日時を表示
    const renderEmptyDate = () => {
        return (
        <View style={styles.emptyDate}>
            <Text>This is empty date!</Text>
        </View>
        );
    };

    // 行が変更されたかどうかを判断
    const rowHasChanged = (r1, r2) => {
        return r1.name !== r2.name;
    };

    // 初期状態や、日付変更に基づいたイベントのロードを行う
    useEffect(() => {
        loadItems({ timestamp: new Date().getTime() }); // 初期データをロード
    }, [loadItems]);

    return (
        <Agenda
            testID={testIDs.agenda.CONTAINER}
            items={items}
            loadItemsForMonth={loadItems}
            selected={'2017-05-16'}
            renderItem={renderItem}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
            showClosingKnob={true}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
    },
    customDay: {
        margin: 10,
        fontSize: 24,
        color: 'green',
    },
    dayItem: {
        marginLeft: 34,
    },
});

export default AgendaScreen;
