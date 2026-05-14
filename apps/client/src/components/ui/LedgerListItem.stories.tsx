import type { Meta, StoryObj } from "@storybook/react-vite";
import { LedgerListItem } from "./LedgerListItem";

const meta: Meta<typeof LedgerListItem> = {
  title: "UI/LedgerListItem",
  component: LedgerListItem,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <LedgerListItem {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof LedgerListItem>;

export const Private: Story = {
  args: {
    name: "هزینه‌های هتل",
    description: "اتاق دو نفره",
    visibility: "PRIVATE_TO_PARTICIPANTS",
  },
};

export const Shared: Story = {
  args: {
    name: "هزینه‌های مشترک",
    visibility: "VISIBLE_TO_GROUP",
  },
};

export const Closed: Story = {
  args: {
    name: "تسویه شده",
    visibility: "VISIBLE_TO_GROUP",
    closed: true,
  },
};
