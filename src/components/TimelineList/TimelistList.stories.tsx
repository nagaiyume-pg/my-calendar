import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { TimelineList } from './TimelineList';

const meta = {
    title: 'TimelineList/TimelineList',
    component: TimelineList,
    args: {
        screenWidth: 375
    },
    decorators: [
        (Story) => (
            <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
                <View style={{ height: 667, width: 375 }}>
                    <Story />
                </View>
            </View>
        ),
    ],
} satisfies Meta<typeof TimelineList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
