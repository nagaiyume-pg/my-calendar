import { ScrollView, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Hours } from './Hours';

const meta = {
    title: 'TimelineList/Hours',
    component: Hours,
    argTypes: {
        onPress: { action: 'pressed the button' },
    },
    args: {
        text: 'Hello world',
    },
    decorators: [
        (Story) => (
        <View style={{ padding: 16, alignItems: 'flex-start' }}>
            <ScrollView>
                <Story />
            </ScrollView>
        </View>
        ),
    ],
} satisfies Meta<typeof Hours>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
