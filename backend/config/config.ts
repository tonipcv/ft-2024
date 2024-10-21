export default {
    dbURL: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  };
  