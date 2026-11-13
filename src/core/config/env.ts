import * as z from 'zod';

const envSchema = z
  .object({
    DISCORD_TOKEN: z.string().min(10),
    DEV_GUILD_ID: z.string().optional(),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'log', 'debug', 'verbose'])
      .default('log'),
    DATABASE_URL: z.string().min(10),
    DASHBOARD_ENABLED: z.stringbool().default(false),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DISCORD_CLIENT_SECRET: z.string().min(10).optional(),
    DASHBOARD_URL: z.url().optional(),
  })
  .superRefine((env, ctx) => {
    if (!env.DASHBOARD_ENABLED) return;

    if (!env.DISCORD_CLIENT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['DISCORD_CLIENT_SECRET'],
        message: 'Required when DASHBOARD_ENABLED is true.',
      });
    }
  })
  .superRefine((env, ctx) => {
    if (!env.DASHBOARD_ENABLED) return;

    if (!env.DASHBOARD_URL) {
      ctx.addIssue({
        code: 'custom',
        path: ['DASHBOARD_URL'],
        message: 'Required when DASHBOARD_ENABLED is true.',
      });
    }
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
