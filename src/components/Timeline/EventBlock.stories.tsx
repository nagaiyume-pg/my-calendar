import { View } from 'react-native';
import { Meta, StoryObj } from '@storybook/react';
import EventBlock, { PackedEvent } from './EventBlock';

// サンプルイベントデータ
const sampleEvent: PackedEvent = {
    index: 0,
    id: '1',
    start: '2025-03-04T09:00:00',
    end: '2025-03-04T10:00:00',
    title: 'ミーティング',
    summary: 'チームとの定例ミーティング',
    color: '#FF5733',  // カスタムカラー
    left: 50,
    top: 100,
    width: 200,
    height: 60,
};

const meta: Meta<typeof EventBlock> = {
    title: 'TimelineList/EventBlock',
    component: EventBlock,
    args: {
        index: 0,
        event: sampleEvent,
    },
    argTypes: {
        onPress: { action: "press the event" }
    },
    decorators: [
        (Story) => (
            <View style={{ flex: 1, padding: 20 }}>
                <Story />
            </View>
        ),
    ],
};

export default meta;

type Story = StoryObj<typeof meta>;

// ストーリー定義
export const Basic: Story = {};
