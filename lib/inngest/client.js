import { Inngest } from 'inngest';

export const inngest = new Inngest({
  id: 'stock-market-app',
  eventKey: process.env.INNGEST_EVENT_KEY,
});
