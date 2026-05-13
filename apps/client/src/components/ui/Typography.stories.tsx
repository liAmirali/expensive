import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = {
  title: "Design System/Typography",
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj;

const Divider = ({ label }: { label: string }) => (
  <p className="text-label-xs font-medium text-text-subtle uppercase tracking-widest mb-4 mt-10 border-b border-border pb-2">
    {label}
  </p>
);

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-baseline gap-6 mb-3">
    <span className="text-label-xs text-text-subtle w-36 shrink-0 text-left" dir="ltr">{label}</span>
    <span className="text-text">{children}</span>
  </div>
);

export const FullScale: Story = {
  name: "Full Scale",
  render: () => (
    <div className="max-w-2xl">

      <Divider label="Display" />
      <Row label="display-2xl / bold">
        <span className="text-display-2xl font-bold">شب‌های تهران</span>
      </Row>
      <Row label="display-xl / bold">
        <span className="text-display-xl font-bold">مخارج مشترک</span>
      </Row>
      <Row label="display-lg / semibold">
        <span className="text-display-lg font-semibold">تسویه حساب</span>
      </Row>
      <Row label="display-md / semibold">
        <span className="text-display-md font-semibold">گروه دوستان</span>
      </Row>
      <Row label="display-sm / semibold">
        <span className="text-display-sm font-semibold">خلاصه ماهانه</span>
      </Row>

      <Divider label="Heading" />
      <Row label="h1 / bold">
        <span className="text-h1 font-bold">مدیریت هزینه‌های روزانه</span>
      </Row>
      <Row label="h2 / bold">
        <span className="text-h2 font-bold">تراکنش‌های اخیر</span>
      </Row>
      <Row label="h3 / semibold">
        <span className="text-h3 font-semibold">پرداخت‌های گروهی</span>
      </Row>
      <Row label="h4 / semibold">
        <span className="text-h4 font-semibold">جزئیات هزینه</span>
      </Row>
      <Row label="h5 / medium">
        <span className="text-h5 font-medium">اعضای گروه</span>
      </Row>
      <Row label="h6 / medium">
        <span className="text-h6 font-medium">بدهی‌های شما</span>
      </Row>

      <Divider label="Body" />
      <Row label="body-xl">
        <span className="text-body-xl">علی برای شام دیشب ۴۸۰,۰۰۰ تومان پرداخت کرد که باید بین سه نفر تقسیم شود.</span>
      </Row>
      <Row label="body-lg">
        <span className="text-body-lg">هزینه‌های این ماه نسبت به ماه قبل ۱۲٪ افزایش داشته است.</span>
      </Row>
      <Row label="body-md">
        <span className="text-body-md">برای تسویه با رضا، مبلغ ۱۶۰,۰۰۰ تومان از طریق کارت بانکی ارسال کنید.</span>
      </Row>
      <Row label="body-sm">
        <span className="text-body-sm">آخرین به‌روزرسانی: دیروز ساعت ۲۲:۳۰ — توسط سارا اضافه شد.</span>
      </Row>
      <Row label="body-xs">
        <span className="text-body-xs">مبالغ به تومان نمایش داده می‌شوند و گرد شده به نزدیک‌ترین هزار تومان هستند.</span>
      </Row>

      <Divider label="Label" />
      <Row label="label-lg / medium">
        <span className="text-label-lg font-medium">نام گروه</span>
      </Row>
      <Row label="label-md / medium">
        <span className="text-label-md font-medium">تاریخ پرداخت</span>
      </Row>
      <Row label="label-sm / medium">
        <span className="text-label-sm font-medium">دسته‌بندی</span>
      </Row>
      <Row label="label-xs / medium">
        <span className="text-label-xs font-medium">اختیاری</span>
      </Row>

      <Divider label="Caption & Overline" />
      <Row label="caption">
        <span className="text-caption">۱۵ خرداد ۱۴۰۴ — ساعت ۱۴:۳۲</span>
      </Row>
      <Row label="overline / semibold">
        <span className="text-overline font-semibold uppercase tracking-widest">تراکنش‌های اخیر</span>
      </Row>

      <Divider label="Weights (body-lg)" />
      <Row label="font-regular">
        <span className="text-body-lg font-regular">نمایش وزن معمولی — ۴۰۰</span>
      </Row>
      <Row label="font-medium">
        <span className="text-body-lg font-medium">نمایش وزن متوسط — ۵۰۰</span>
      </Row>
      <Row label="font-semibold">
        <span className="text-body-lg font-semibold">نمایش وزن نیمه‌ضخیم — ۶۰۰</span>
      </Row>
      <Row label="font-bold">
        <span className="text-body-lg font-bold">نمایش وزن ضخیم — ۷۰۰</span>
      </Row>

    </div>
  ),
};
