import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./Avatar";

const meta: Meta<typeof Avatar> = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl">
      <Avatar {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof Avatar>;
export const Default: Story = { args: { name: "سارا محمدی", tone: "violet", size: "md" } };
export const Large: Story = { args: { name: "علی رضایی", tone: "teal", size: "lg" } };
