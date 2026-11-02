import { Module } from '@nestjs/common';
import { UtilityCommands } from './utillity.commands.js';

@Module({
  providers: [UtilityCommands],
})
export class UtilityModule {}
