import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <Textarea {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { label: "توضیحات", placeholder: "توضیح کوتاهی بنویسید…" },
};

export const WithError: Story = {
  args: {
    label: "توضیحات",
    placeholder: "…",
    error: "حداکثر ۵۰۰ کاراکتر مجاز است",
  },
};
