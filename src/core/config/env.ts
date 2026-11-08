import * as z from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
  DEV_GUILD_ID: z.string().optional(),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'log', 'debug', 'verbose'])
    .default('log'),
  DATABASE_URL: z.string().min(10),
  DASHBOARD_ENABLED: z.stringbool().default(false),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (config: Record<string, unknown>): Env => {
  const result = envSchema.safeParse(config);
  if (result.success) {
    return result.data;
  }

  const details = result.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`Invalid Configuration: \n${details}`);
};
