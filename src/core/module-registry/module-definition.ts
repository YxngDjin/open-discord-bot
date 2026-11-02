import * as z from 'zod';

export type ModuleDefinition<TSchema extends z.ZodObject = z.ZodObject> = {
  key: string;
  settingsSchema: TSchema;
};
