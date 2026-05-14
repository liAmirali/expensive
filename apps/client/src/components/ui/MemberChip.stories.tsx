import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemberChip } from "./MemberChip";

const meta: Meta<typeof MemberChip> = {
  title: "UI/MemberChip",
  component: MemberChip,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl">
      <MemberChip {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof MemberChip>;

export const Removable: Story = {
  args: { name: "سارا محمدی", tone: "violet", onRemove: () => {} },
};

export const Static: Story = {
  args: { name: "علی رضایی", tone: "teal" },
};
