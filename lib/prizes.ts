import type { IconType } from "react-icons";
import { FaPercent, FaCoins, FaCrown, FaTag } from "react-icons/fa";
import {
  FaRotateRight,
  FaTruckFast,
  FaTicketSimple,
  FaMoneyBillTrendUp,
} from "react-icons/fa6";

export interface Prize {
  id: string;
  label: string;
  color: string;
  weight: number;
  icon: IconType;
}

export const PRIZES: Prize[] = [
  {
    id: "again",
    label: "Try Again",
    color: "#C8D1E2",
    weight: 40,
    icon: FaRotateRight,
  },
  {
    id: "voucher10",
    label: "₱10 OFF",
    color: "#C8D1E2",
    weight: 22,
    icon: FaTag,
  },
  {
    id: "coins20",
    label: "20 Coins",
    color: "#C8D1E2",
    weight: 15,
    icon: FaCoins,
  },
  {
    id: "ship",
    label: "Free Shipping",
    color: "#C8D1E2",
    weight: 10,
    icon: FaTruckFast,
  },
  {
    id: "voucher50",
    label: "₱50 Voucher",
    color: "#C8D1E2",
    weight: 7,
    icon: FaTicketSimple,
  },
  {
    id: "off15",
    label: "15% OFF",
    color: "#C8D1E2",
    weight: 4,
    icon: FaPercent,
  },
  {
    id: "cashback100",
    label: "₱100 voucher",
    color: "#C8D1E2",
    weight: 1.5,
    icon: FaMoneyBillTrendUp,
  },
  {
    id: "jackpot500",
    label: "₱500 Jackpot",
    color: "#C8D1E2",
    weight: 0.5,
    icon: FaCrown,
  },
];

export const DAILY_SPIN_LIMIT_ENABLED = true;
export const DAILY_SPIN_LIMIT = 3;
