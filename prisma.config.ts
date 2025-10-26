import 'dotenv/config';

import { defineConfig } from 'prisma/config';

export default defineConfig({
  migrations: {
    seed: `tsx ./lib/db/seed.ts`,
  },
  schema: './lib/db/schema.prisma',
});
