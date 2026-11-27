export type DiscountInput = {
  id: String;
  name: String;
  type: 'FIXED' | 'PERCENTAGE';
  value: number;
  rule: 'NEWMEMBER' | 'WEEKDAY' | 'DATE_RANGE';
  weekday?: number | null;
  startsAt?: Date | null;
  endsAt?: Date | null;
  newMemberDays?: number | null;
  maxDiscount?: number | null;
  minSubTotal?: number | null;
  isActive: boolean;
};

export type DiscountContext = {
  subTotal: number; // total items price
  now: Date;
  memberSince: Date; // profile.cretedAt
  paidOrderCount: number; // paid orders so far
};

// determine what day today , 1 = monday , 7 = sunday
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000; //Jakarta is UTC+7, no daylight saving
export const isoWeekDayWIB = (d: Date): number => {
  const day = new Date(d.getDate() + WIB_OFFSET_MS).getUTCDay(); // 0 = Sunday
  return day === 0 ? 7 : day;
};

export const applies = (
  p: DiscountInput,
  context: DiscountContext,
): boolean => {
  if (!p.isActive) return false;
  if (p.minSubTotal && context.subTotal < p.minSubTotal) return false;

  switch (p.rule) {
    case 'WEEKDAY':
      return p.weekday === isoWeekDayWIB(context.now);
    case 'DATE_RANGE':
      return (
        !!p.startsAt &&
        !!p.endsAt &&
        context.now >= p.startsAt &&
        context.now <= p.endsAt
      );
    case 'NEWMEMBER':
      const days = p.newMemberDays ?? 30; // default 30
      const ageMs = context.now.getTime() - context.memberSince.getTime();
      return context.paidOrderCount === 0 && ageMs <= days * 86_400_000;
  }
};

export const amountOf = (p: DiscountInput, subTotal: number): number => {
  let amount =
    p.type === 'PERCENTAGE' ? Math.floor(subTotal * p.value) / 100 : p.value;
  if (p.maxDiscount != null) amount = Math.min(amount, p.maxDiscount);
  return Math.min(amount, subTotal);
};

export function calculateBestDiscount(promos: DiscountInput[], ctx: DiscountContext) {
  let best: { promotion: DiscountInput; amount: number } | null = null;
  for (const p of promos) {
    if (!applies(p, ctx)) continue;
    const amount = amountOf(p, ctx.subTotal);
    if (!best || amount > best.amount) best = { promotion: p, amount };
  }
  const discount = best?.amount ?? 0;
  return { promotion: best?.promotion ?? null, discount, total: ctx.subTotal - discount };
}