import type { Meta, StoryObj } from "@storybook/react-vite";
import { UserSearchResultItem } from "./UserSearchResultItem";

const meta: Meta<typeof UserSearchResultItem> = {
  title: "UI/UserSearchResultItem",
  component: UserSearchResultItem,
  parameters: { layout: "centered" },
  render: (args) => (
    <div dir="rtl" className="w-95">
      <UserSearchResultItem {...args} />
    </div>
  ),
};
export default meta;

type Story = StoryObj<typeof UserSearchResultItem>;

export const Default: Story = {
  args: { fullName: "سارا محمدی", email: "sara@example.com" },
};

export const Disabled: Story = {
  args: { fullName: "علی رضایی", email: "ali@example.com", disabled: true },
};
