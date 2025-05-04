export const formatMoney = (value: string): string => {
  // Remove any existing thousand separators and non-numeric characters except decimal
  const cleanValue = value.replace(/[^\d]/g, "");
  
  // Add thousand separators
  return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseMoney = (value: string): string => {
  // Remove all non-numeric characters
  return value.replace(/[^\d]/g, "");
};
