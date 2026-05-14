import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExpenseCard } from "./ExpenseCard";

const meta: Meta<typeof ExpenseCard> = {
  title: "UI/ExpenseCard",
  component: ExpenseCard,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <ExpenseCard {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof ExpenseCard>;

export const Owed: Story = {
  args: {
    title: "پیتزا",
    description: "غذا و رستوران",
    totalAmount: 280_000,
    payerName: "شما",
    isPayerMe: true,
    myShare: 70_000,
    direction: "owed",
    participantCount: 4,
    dateLabel: "۱۷ اردیبهشت",
  },
};

export const Owe: Story = {
  args: {
    title: "اسنپ تا فرودگاه",
    totalAmount: 320_000,
    payerName: "علی رضایی",
    myShare: 80_000,
    direction: "owe",
    participantCount: 4,
    dateLabel: "دیروز",
  },
};

export const Settled: Story = {
  args: {
    title: "بنزین",
    totalAmount: 200_000,
    payerName: "مریم محمدی",
    myShare: 0,
    direction: "settled",
    participantCount: 5,
    dateLabel: "هفته پیش",
  },
};