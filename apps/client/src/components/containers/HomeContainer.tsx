import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, UtensilsCrossed, Car, Home as HomeIcon, Plane } from "lucide-react";
import { HomeView } from "@/components/views/HomeView";
import type { ExpenseListItemProps } from "@/components/ui/ExpenseListItem";
import { clearAuthTokens } from "@/utils/authToken";

const FAKE_EXPENSES: (ExpenseListItemProps & { id: string })[] = [
  {
    id: "1",
    icon: <UtensilsCrossed size={20} />,
    title: "شام رستوران ایتالیایی",
    subtitle: "گروه دوستان",
    amount: 480_000,
    direction: "owed",
    timeLabel: "12:30",
    iconTone: "teal",
  },
  {
    id: "2",
    icon: <ShoppingCart size={20} />,
    title: "خرید هفتگی",
    subtitle: "گروه خانه",
    amount: 1_240_000,
    direction: "owe",
    timeLabel: "08:00",
    iconTone: "cerise",
  },
  {
    id: "3",
    icon: <Car size={20} />,
    title: "اسنپ تا فرودگاه",
    subtitle: "سفر شمال",
    amount: 320_000,
    direction: "owed",
    timeLabel: "دیروز",
    iconTone: "violet",
  },
  {
    id: "4",
    icon: <Plane size={20} />,
    title: "بلیط هواپیما",
    subtitle: "سفر شمال",
    amount: 2_800_000,
    direction: "owe",
    timeLabel: "۲ روز پیش",
    iconTone: "sand",
  },
  {
    id: "5",
    icon: <HomeIcon size={20} />,
    title: "اجاره خانه",
    subtitle: "تسویه شده",
    amount: 5_500_000,
    direction: "settled",
    timeLabel: "هفته پیش",
    iconTone: "ink",
  },
];

export function HomeContainer() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthTokens();
    navigate({ to: "/signin" });
  };

  return (
    <HomeView
      userName="سارا"
      netBalance={1_240_000}
      balanceCaption="از ۳ گروه فعال"
      recentExpenses={FAKE_EXPENSES}
      onLogoutClick={handleLogout}
    />
  );
}
