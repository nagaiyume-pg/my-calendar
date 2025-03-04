import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './TimelineList';

const meta = {
    title: 'TimelineList/Timeline',
    component: Timeline,
    args: {
        screenWidth: 375,
        height: 667,
        hourHeight: 100,
    },
    decorators: [
        (Story) => (
            <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
                <Story />
            </View>
        ),
    ],
} satisfies Meta<typeof Timeline>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
