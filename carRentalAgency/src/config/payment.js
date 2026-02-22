export const paymentConfig = {
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
}

export const hasRazorpayConfig = Boolean(paymentConfig.razorpayKeyId)
