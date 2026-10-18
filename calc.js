// Premium calculator for AIA plans.
// Sources:
//   20 Pay Life  — AIA 20PLNP_TH_01072022.pdf (rate table, page 5); re-checked against AIA rate book 02/2025
//   Senior Happy — AIA rate book 02/2025 (matches aia-fa.com and brochure examples)
//   CI Plus      — AIA CI Plus brochure rate page (ci-plus.jpg); age-banded, renewable
//   CI SuperCare 20/99 — public brochure SU0215396 (01/01/2023), total premium column; same in rate book 02/2025
(function (root) {
  // Index = age (0 = 15 days – under 1 year), per 1,000 baht sum assured
  const PAY20 = {
    M: [12.76, 12.81, 12.98, 13.15, 13.33, 13.53, 13.73, 13.95, 14.18, 14.42, 14.68, 14.96, 15.23, 15.52, 15.80, 16.09,
      16.38, 16.67, 16.97, 17.27, 17.58, 17.90, 18.23, 18.57, 18.93, 19.31, 19.70, 20.12, 20.56, 21.02, 21.50, 22.01, 22.55, 23.11, 23.69, 24.30,
      24.94, 25.61, 26.31, 27.04, 27.80, 28.60, 29.44, 30.32, 31.24, 32.20, 33.22, 34.28, 35.40, 36.57, 37.81, 39.13, 40.51, 41.99, 43.56, 45.25,
      47.05, 48.99, 51.08, 53.33, 55.77, 58.42, 61.29, 64.19, 66.96, 69.89, 71.99, 73.80, 75.13, 76.40, 78.11],
    F: [11.47, 11.47, 11.51, 11.58, 11.68, 11.80, 11.94, 12.10, 12.27, 12.45, 12.66, 12.87, 13.09, 13.32, 13.56, 13.76,
      13.97, 14.19, 14.41, 14.65, 14.90, 15.15, 15.43, 15.71, 16.00, 16.31, 16.64, 16.98, 17.34, 17.72, 18.11, 18.53, 18.96, 19.42, 19.90, 20.40,
      20.93, 21.48, 22.06, 22.67, 23.30, 23.96, 24.66, 25.39, 26.15, 26.95, 27.79, 28.68, 29.61, 30.59, 31.62, 32.72, 33.88, 35.11, 36.41, 37.81,
      39.29, 40.89, 42.60, 44.44, 46.43, 48.59, 50.93, 53.49, 56.27, 59.32, 61.90, 63.61, 64.71, 66.13, 67.07],
  };

  // Index = age - 50
  const SENIOR = {
    M: [59.80, 61.52, 63.25, 64.97, 66.70, 68.42, 70.15, 73.60, 77.05, 80.50, 83.95, 87.40, 90.85, 94.30, 98.32, 102.35, 107.52, 112.12, 116.72, 121.90, 127.65],
    F: [50.02, 51.75, 53.47, 55.20, 56.92, 58.07, 59.22, 61.52, 63.82, 66.12, 68.42, 70.72, 74.17, 77.62, 81.07, 84.52, 87.97, 91.42, 96.60, 102.35, 106.95],
  };

  // [max age of band, male, female]
  const CI_BANDS = [
    [15, 2.62, 2.27], [20, 2.76, 2.06], [25, 2.89, 2.15], [30, 3.16, 2.55], [35, 3.84, 3.53],
    [40, 5.23, 4.60], [45, 10.19, 6.38], [50, 15.92, 10.17], [55, 25.38, 15.92], [60, 42.31, 26.09],
    [65, 61.04, 35.81], [70, 81.76, 51.71], [75, 112.64, 73.52],
    // Renewal-only bands (cannot be bought new above 75): 76-80 142.38/104.55, 81-85 183.10/139.66,
    // 86-90 261.54/240.90, 91-95 386.58/384.25, 96-98 503.41/497.74
  ];

  // Index = age (0 = 15 days – under 1 year), level premium paid 20 years
  const SUPERCARE20 = {
    M: [22.20, 22.46, 22.73, 23.02, 23.33, 23.65, 23.99, 24.35, 24.73, 25.12, 25.53, 25.94, 26.37, 26.80, 27.24, 27.70, 28.15, 28.62, 29.12, 29.63,
      30.16, 30.72, 31.31, 31.91, 32.54, 33.19, 33.86, 34.55, 35.28, 36.05, 36.85, 37.70, 38.59, 39.53, 40.52, 41.57, 42.28, 43.04, 43.86, 44.74,
      45.68, 46.65, 47.63, 48.62, 49.65, 50.72, 52.82, 55.08, 57.52, 60.13, 62.92, 65.93, 69.10, 72.48, 76.04, 79.72, 83.55, 87.51, 91.65, 96.02,
      100.65, 105.58, 110.82, 116.36, 122.25, 128.52],
    F: [20.42, 20.63, 20.85, 21.09, 21.35, 21.61, 21.89, 22.19, 22.49, 22.81, 23.14, 23.59, 24.06, 24.54, 25.04, 25.54, 26.06, 26.48, 26.94, 27.42,
      27.92, 28.43, 28.96, 29.50, 30.06, 30.64, 31.25, 31.88, 32.53, 33.21, 33.91, 34.64, 35.39, 36.16, 36.96, 37.78, 38.62, 39.50, 40.43, 41.41,
      42.45, 43.63, 44.85, 46.11, 47.41, 48.76, 50.18, 51.68, 53.27, 54.94, 56.71, 58.57, 60.52, 62.56, 64.69, 66.91, 69.21, 71.59, 74.08, 76.70,
      79.47, 82.44, 85.61, 89.01, 92.65, 96.58],
  };

  const PLANS = {
    pay20: { minAge: 0, maxAge: 70, minSA: 100000, sumAssured: [100000, 300000, 500000, 1000000, 2000000, 3000000, 5000000] },
    senior: { minAge: 50, maxAge: 70, minSA: 50000, maxSA: 200000, sumAssured: [50000, 100000, 150000, 200000] },
    ci: { minAge: 0, maxAge: 75, sumAssured: [500000, 1000000, 2000000, 3000000, 5000000] },
    supercare20: { minAge: 0, maxAge: 65, minSA: 200000, maxSA: 15000000 }, // max 5M for people without income
    // Choices for the "illness" goal: valid for 20 Pay Life, CI Plus and CI SuperCare alike
    illness: { sumAssured: [500000, 1000000, 2000000, 3000000] },
  };

  function pay20Discount(sa) {
    if (sa >= 600000) return 2;
    if (sa >= 250000) return 1;
    return 0;
  }

  function premiumPay20(gender, age, sa) {
    const rate = PAY20[gender][age];
    if (rate === undefined || sa < PLANS.pay20.minSA) return null;
    return Math.round((rate - pay20Discount(sa)) * sa / 1000);
  }

  function premiumSenior(gender, age, sa) {
    const rate = SENIOR[gender][age - 50];
    if (rate === undefined || sa < PLANS.senior.minSA || sa > PLANS.senior.maxSA) return null;
    return Math.round(rate * sa / 1000);
  }

  function premiumCI(gender, age, sa) {
    const band = CI_BANDS.find((b) => age <= b[0]);
    if (!band || age < 0) return null;
    return Math.round((gender === 'M' ? band[1] : band[2]) * sa / 1000);
  }

  function supercareDiscount(sa) {
    if (sa >= 5000000) return 2;
    if (sa >= 1000000) return 1.5;
    if (sa >= 800000) return 1;
    if (sa >= 500000) return 0.5;
    return 0;
  }

  function premiumSuperCare20(gender, age, sa) {
    const rate = SUPERCARE20[gender][age];
    const p = PLANS.supercare20;
    if (rate === undefined || sa < p.minSA || sa > p.maxSA) return null;
    return Math.round((rate - supercareDiscount(sa)) * sa / 1000);
  }

  const api = { PLANS, pay20Discount, premiumPay20, premiumSenior, premiumCI, supercareDiscount, premiumSuperCare20 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AIACalc = api;
})(this);
