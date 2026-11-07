import { Module } from '@nestjs/common';
import { UtilityCommands } from './utility.commands.js';

@Module({
  providers: [UtilityCommands],
})
export class UtilityModule {}
