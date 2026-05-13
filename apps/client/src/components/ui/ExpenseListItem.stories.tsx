import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingCart, UtensilsCrossed, Car } from "lucide-react";
import { ExpenseListItem } from "./ExpenseListItem";

const meta: Meta<typeof ExpenseListItem> = {
  title: "UI/ExpenseListItem",
  component: ExpenseListItem,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <ExpenseListItem {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof ExpenseListItem>;

export const Owed: Story = {
  args: {
    icon: <UtensilsCrossed size={20} />,
    title: "شام رستوران",
    subtitle: "گروه دوستان",
    amount: 320_000,
    direction: "owed",
    timeLabel: "12:00",
    iconTone: "teal",
  },
};

export const Owe: Story = {
  args: {
    icon: <ShoppingCart size={20} />,
    title: "خرید هفتگی",
    subtitle: "گروه خانه",
    amount: 540_000,
    direction: "owe",
    timeLabel: "08:30",
    iconTone: "cerise",
  },
};

export const Settled: Story = {
  args: {
    icon: <Car size={20} />,
    title: "اسنپ فرودگاه",
    subtitle: "تسویه شده",
    amount: 180_000,
    direction: "settled",
    timeLabel: "دیروز",
    iconTone: "violet",
  },
};
