import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Numpad } from "./Numpad";
import { formatToman } from "@/utils/numerals";

const meta: Meta<typeof Numpad> = {
  title: "UI/Numpad",
  component: Numpad,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Numpad>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState("0");
    const push = (d: string) => setV((p) => (p === "0" ? d : p + d));
    return (
      <div dir="rtl" className="w-72 flex flex-col gap-4">
        <p className="text-center text-h2 font-bold tabular-nums">
          {formatToman(Number(v))}
        </p>
        <Numpad
          onDigit={push}
          onBackspace={() => setV((p) => (p.length <= 1 ? "0" : p.slice(0, -1)))}
          onTripleZero={() => setV((p) => (p === "0" ? "0" : p + "000"))}
        />
      </div>
    );
  },
};
