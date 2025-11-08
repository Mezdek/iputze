import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: `tsx ./lib/server/db/seed.ts`,
  },
  schema: './lib/server/db/schema.prisma',
});
