export function deliveryChargeByDistrict(_district, subtotal = 0) {
  return Number(subtotal || 0) >= 800 ? 0 : 80;
}

export function calcCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) return 0;
  if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}
