export function deliveryChargeByDistrict(district) {
  const d = (district || "").toLowerCase();
  return d.includes("dhaka") ? 60 : 120;
}

export function calcCouponDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) return 0;
  if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
  return Math.min(coupon.value, subtotal);
}