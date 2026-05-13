import type { Meta, StoryObj } from "@storybook/react-vite";
import { GroupListItem } from "./GroupListItem";

const meta: Meta<typeof GroupListItem> = {
  title: "UI/GroupListItem",
  component: GroupListItem,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <GroupListItem {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof GroupListItem>;

export const Default: Story = {
  args: { name: "سفر شمال", memberCount: 5, accent: "violet" },
};

export const WithDescription: Story = {
  args: {
    name: "هم‌خانه",
    description: "هزینه‌های ماهانه خانه",
    memberCount: 3,
    accent: "teal",
  },
};
