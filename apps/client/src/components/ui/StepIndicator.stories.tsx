import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepIndicator } from "./StepIndicator";

const meta: Meta<typeof StepIndicator> = {
  title: "UI/StepIndicator",
  component: StepIndicator,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl">
      <StepIndicator {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof StepIndicator>;
export const Default: Story = { args: { current: 2, total: 4 } };
