import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    size:  { control: "select", options: ["sm", "md", "lg"] },
    shape: { control: "select", options: ["pill", "rounded", "square"] },
    state: { control: "select", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TomanIcon = () => (
  <span className="text-label-sm font-medium">ت</span>
);

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    placeholder: "نام گروه را وارد کنید",
    label: "نام گروه",
    size: "md",
    shape: "pill",
    state: "default",
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input size="sm" placeholder="کوچک — small" />
      <Input size="md" placeholder="متوسط — medium" />
      <Input size="lg" placeholder="بزرگ — large" />
    </div>
  ),
};

// ── Shapes ────────────────────────────────────────────────────────────────────

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input shape="pill"    placeholder="کپسولی — pill" />
      <Input shape="rounded" placeholder="گرد — rounded" />
      <Input shape="square"  placeholder="مربعی — square" />
    </div>
  ),
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Input label="پیش‌فرض" placeholder="مقدار را وارد کنید" />
      <Input label="موفقیت" defaultValue="علی محمدی" state="success" helperText="نام معتبر است" />
      <Input label="خطا" defaultValue="ali" error="حداقل ۵ کاراکتر وارد کنید" />
      <Input label="غیرفعال" placeholder="غیرفعال" disabled />
    </div>
  ),
};

// ── With Icons ────────────────────────────────────────────────────────────────

export const WithIcons: Story = {
  name: "With Icons",
  render: () => (
    <div className="flex flex-col gap-4">
      <Input placeholder="جستجوی هزینه" startIcon={<SearchIcon />} />
      <Input placeholder="مبلغ" endIcon={<TomanIcon />} />
      <Input placeholder="جستجو در گروه" startIcon={<SearchIcon />} endIcon={<TomanIcon />} />
    </div>
  ),
};

// ── With Label & Helper ───────────────────────────────────────────────────────

export const WithLabelHelper: Story = {
  name: "With Label & Helper",
  render: () => (
    <div className="flex flex-col gap-4">
      <Input
        label="مبلغ پرداختی"
        placeholder="۰"
        endIcon={<TomanIcon />}
        helperText="مبلغ به تومان وارد شود"
      />
      <Input
        label="ایمیل"
        type="email"
        defaultValue="ali@invalid"
        error="فرمت ایمیل نامعتبر است"
      />
    </div>
  ),
};
