import type { Meta, StoryObj } from "@storybook/react-vite";
import { BalanceCard } from "./BalanceCard";

const meta: Meta<typeof BalanceCard> = {
  title: "UI/BalanceCard",
  component: BalanceCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BalanceCard>;

export const Positive: Story = {
  args: { label: "خالص موجودی", amount: 1_240_000, caption: "از ۳ گروه" },
  render: (args) => (
    <div dir="rtl" className="w-90">
      <BalanceCard {...args} />
    </div>
  ),
};

export const Negative: Story = {
  args: { label: "خالص موجودی", amount: -480_000, caption: "بدهکار هستید" },
  render: (args) => (
    <div dir="rtl" className="w-90">
      <BalanceCard {...args} />
    </div>
  ),
};
