import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'mongodb',
    url: process.env.MONGODB_URI,
  },
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || 'http://localhost:3000'],
  secret: process.env.BETTER_AUTH_SECRET || 'd335d6e2278076265ffac97deca3932124bf22efdceadaaa7b15a8fae889279b',
});