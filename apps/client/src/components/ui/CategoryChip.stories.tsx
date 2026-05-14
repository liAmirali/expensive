import type { Meta, StoryObj } from "@storybook/react-vite";
import { UtensilsCrossed } from "lucide-react";
import { CategoryChip } from "./CategoryChip";

const meta: Meta<typeof CategoryChip> = {
  title: "UI/CategoryChip",
  component: CategoryChip,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl">
      <CategoryChip {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof CategoryChip>;
export const Idle: Story = { args: { label: "غذا", icon: <UtensilsCrossed size={14} /> } };
export const Selected: Story = { args: { label: "غذا", icon: <UtensilsCrossed size={14} />, selected: true } };
