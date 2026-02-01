import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { connectToDatabase } from "@/lib/database";

// Connect to database before handling requests
await connectToDatabase();

// Export the handlers directly
export const { GET, POST } = toNextJsHandler(auth);