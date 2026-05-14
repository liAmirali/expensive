import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "UI/StatCard",
  component: StatCard,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-60">
      <StatCard {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof StatCard>;

export const Owed: Story = {
  args: {
    label: "طلب شما",
    amount: 1_240_000,
    tone: "positive",
    icon: <ArrowDownLeft size={16} />,
    caption: "از ۳ نفر",
  },
};

export const Owe: Story = {
  args: {
    label: "بدهی شما",
    amount: 540_000,
    tone: "negative",
    icon: <ArrowUpRight size={16} />,
    caption: "به ۲ نفر",
  },
};
