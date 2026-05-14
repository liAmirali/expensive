import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Lock, Users } from "lucide-react";
import { SegmentedControl } from "./SegmentedControl";

const meta: Meta<typeof SegmentedControl> = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SegmentedControl>;

export const Visibility: Story = {
  render: () => {
    const [value, setValue] = useState<"private" | "group">("private");
    return (
      <div dir="rtl" className="w-95">
        <SegmentedControl
          label="دیده‌شدن"
          value={value}
          onChange={setValue}
          options={[
            { value: "private", label: "خصوصی", icon: <Lock size={14} /> },
            { value: "group",   label: "گروه",   icon: <Users size={14} /> },
          ]}
        />
      </div>
    );
  },
};
