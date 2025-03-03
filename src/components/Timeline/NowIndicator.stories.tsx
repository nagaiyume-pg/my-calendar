import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { NowIndicator } from './TimelineList';

const meta = {
    title: 'TimelineList/NowIndicator',
    component: NowIndicator,
    args: {
        screenWidth: 375
    },
    decorators: [
        (Story) => (
            <ScrollView>
                <View style={{ alignItems: 'center', backgroundColor: "#e5e7eb", flex: 1, justifyContent: "flex-start" }}>
                    <View style={{ backgroundColor: "white", display: "flex", height: 2400, width: 375 }}>
                        <Story />
                    </View>
                </View>
            </ScrollView>
        ),
    ],
} satisfies Meta<typeof NowIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
