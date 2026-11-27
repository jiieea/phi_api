// import PromoInput and calculateBaseDiscount
import {
  DiscountInput,
  calculateBestDiscount,
} from './discount-engine.js';

const base = { isActive: true } as const;
const monday15: DiscountInput = {
  ...base,
  id: 'm',
  name: 'Monday',
  type: 'PERCENTAGE',
  value: 15,
  rule: 'WEEKDAY',
  weekday: 1,
};
const newMember10: DiscountInput = {
  ...base,
  id: 'n',
  name: 'New Member',
  type: 'PERCENTAGE',
  value: 10,
  rule: 'NEWMEMBER',
  newMemberDays: 30,
};

const mondayNoon = new Date('2026-11-23T05:00:00Z'); // Mon 12:00 WIB
const sunday2330 = new Date('2026-11-22T16:30:00Z'); // Sun 23:30 WIB
const monday0030 = new Date('2026-11-22T17:30:00Z'); // Mon 00:30 WIB\

// create payment context
const context = (now: Date, extra = {}) => ({
  subTotal: 100_000,
  now,
  memberSince: new Date('2026-01-01T00:00:00Z'),
  paidOrderCount: 0,
  ...extra,
});

// Monday Discount
it('Discont 15% OFF on Monday , 15% of 100,000 = 15,000 ', () => {
  expect(calculateBestDiscount([monday15], context(mondayNoon)).discount).toBe(
    15_000,
  );
});

it('Sunday 23:30 get nothing , Monday 00:30 get discount', () => {
  expect(calculateBestDiscount([monday15], context(sunday2330)).discount).toBe(
    0,
  );
  expect(calculateBestDiscount([monday15], context(monday0030)).discount).toBe(
    15_000,
  );
});

it('New Member + Monday , best single wins , total 85,000', () => {
  const r = calculateBestDiscount(
    [monday15, newMember10],
    context(mondayNoon, { memberSince: new Date('2026-01-01T00:00:00Z') }),
  );
  expect(r.discount).toBe(15_000);
  expect(r.total).toBe(85_000);
});

// paidOrderCount >= 0 , user get no discount
it('Member who already ordered got no discount ', () => {
  expect(
    calculateBestDiscount(
      [newMember10],
      context(monday0030, { paidOrderCount: 1 }),
    ).discount,
  ).toBe(0);
});

// fixed discount never exceeds subtotal
it('fixed discount never exceeds subtotal', () => {
  const bg : DiscountInput = {
    ...base,
    id: 'f',
    name: 'big',
    rule: 'WEEKDAY',
    value: 500_000,
    type: 'FIXED',
    weekday: 1,
  };
  expect(calculateBestDiscount([bg] , context(mondayNoon)).total).toBe(0)
});

it('inactive promo ignored; empty list gives no discount', () => {
  expect(
    calculateBestDiscount([{ ...monday15, isActive: false }], context(mondayNoon))
      .discount,
  ).toBe(0);
  expect(calculateBestDiscount([], context(mondayNoon)).total).toBe(100_000);
});
