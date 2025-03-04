import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import Timeline from './Timeline';

const meta = {
    title: 'TimelineList/Timeline',
    component: Timeline,
    args: {
        startTime: 0,
        endTime: 24,
        hourHeight: 100,
        dimensionWidth: 375,
        verticalLineLeftInset: 50,
    },
    decorators: [
        (Story) => (
            <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
                <View style={{ display: "flex", height: 667, width: 375 }}>
                    <Story />
                </View>
            </View>
        ),
    ],
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
