import { Module, OnModuleInit } from '@nestjs/common';
import { ModuleRegistryService } from '../../core/module-registry/module-registry.service.js';
import { tempVoiceModule } from './temp-voice.definition.js';
import { TempVoiceService } from './temp-voice.service.js';
import { TempVoiceListener } from './temp-voice.listener.js';
import { TempVoiceCommands } from './temp-voice.commands.js';
import { TempVoiceOwnerCommands } from './temp-voice-owner.commands.js';

@Module({
  providers: [
    TempVoiceService,
    TempVoiceListener,
    TempVoiceCommands,
    TempVoiceOwnerCommands,
  ],
})
export class TempVoiceModule implements OnModuleInit {
  constructor(private readonly moduleRegistry: ModuleRegistryService) {}

  onModuleInit() {
    this.moduleRegistry.registerModule(tempVoiceModule);
  }
}
