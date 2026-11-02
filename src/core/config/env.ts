import * as z from 'zod';

const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(10),
  DEV_GUILD_ID: z.string().optional(),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'log', 'debug', 'verbose'])
    .default('log'),
  DATABASE_URL: z.string().min(10),
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

  console.log(details);

  throw new Error(`Ungültige Konfiguration:\n${details}`);
};
