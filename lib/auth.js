import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import clientPromise from './mongodb';

export const auth = betterAuth({
  database: mongodbAdapter(clientPromise),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: ['http://localhost:3000'],
  secret: process.env.BETTER_AUTH_SECRET || 'd335d6e2278076265ffac97deca3932124bf22efdceadaaa7b15a8fae889279b',
});