import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Hours } from './TimelineList';

const meta = {
    title: 'TimelineList/Hours',
    component: Hours,
    args: {
        screenWidth: 375
    },
    decorators: [
        (Story) => (
        <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
            <View style={{ height: 667, width: 375, backgroundColor: "white" }}>
                <ScrollView>
                    <Story />
                </ScrollView>
            </View>
        </View>
        ),
    ],
} satisfies Meta<typeof Hours>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
