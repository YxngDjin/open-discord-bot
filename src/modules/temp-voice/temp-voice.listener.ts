import { Injectable, Logger } from '@nestjs/common';
import { TempVoiceService } from './temp-voice.service.js';
import { Context, type ContextOf, On } from 'necord';

@Injectable()
export class TempVoiceListener {
  private readonly logger = new Logger(TempVoiceListener.name);
  constructor(private readonly tempVoiceService: TempVoiceService) {}

  @On('voiceStateUpdate')
  async onVoiceStateUpdate(
    @Context() [oldState, newState]: ContextOf<'voiceStateUpdate'>,
  ) {
    this.logger.debug(
      `onVoiceStateUpdate: ${oldState.channelId} -> ${newState.channelId}`,
    );

    if (oldState.channelId === newState.channelId) return;

    if (newState.channelId) {
      await this.tempVoiceService.handleJoin(newState);
    }
    if (oldState.channelId) {
      await this.tempVoiceService.handleLeave(oldState);
    }
  }
}
