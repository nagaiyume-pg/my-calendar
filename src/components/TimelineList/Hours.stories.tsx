import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Hours } from './Hours';

const meta = {
    title: 'TimelineList/Hours',
    component: Hours,
    args: {
        screenWidth: 375,
    },
    decorators: [
        (Story) => (
            <ScrollView>
                <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
                    <View style={{ backgroundColor: "#ffffff", display: "flex", height: 2400, width: 375 }}>
                        <Story />
                    </View>
                </View>
            </ScrollView>
        ),
    ],
} satisfies Meta<typeof Hours>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
