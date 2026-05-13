import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant:  { control: "select", options: ["solid", "outline", "ghost", "soft", "link"] },
    color:    { control: "select", options: ["default", "neutral", "positive", "negative", "warning"] },
    size:     { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    shape:    { control: "select", options: ["rounded", "pill", "square"] },
    width:    { control: "select", options: ["auto", "full"] },
    iconOnly: { control: "boolean" },
    loading:  { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    children: "Button",
    variant: "solid",
    color: "default",
    size: "md",
    shape: "rounded",
  },
};

// ── Variants ──────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid">Solid</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// ── Colors ────────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["solid", "outline", "soft", "ghost"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-3">
          {(["default", "neutral", "positive", "negative", "warning"] as const).map((color) => (
            <Button key={color} variant={variant} color={color} size="sm">
              {color}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

// ── Shapes ────────────────────────────────────────────────────────────────────

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button shape="rounded">Rounded</Button>
      <Button shape="pill">Pill</Button>
      <Button shape="square">Square</Button>
    </div>
  ),
};

// ── Loading ───────────────────────────────────────────────────────────────────

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving</Button>
      <Button loading variant="outline">Saving</Button>
      <Button loading size="sm">Saving</Button>
    </div>
  ),
};

// ── Disabled ──────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Disabled</Button>
      <Button disabled variant="outline">Disabled</Button>
      <Button disabled variant="ghost">Disabled</Button>
    </div>
  ),
};

// ── Full Width ────────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-3 w-80">
      <Button width="full" size="lg">Settle Up</Button>
      <Button width="full" variant="outline" color="neutral">Cancel</Button>
    </div>
  ),
};
