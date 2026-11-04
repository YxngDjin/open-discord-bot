import { Injectable } from '@nestjs/common';
import { XpService } from './xp.service.js';
import { Context, type ContextOf, On } from 'necord';

@Injectable()
export class XpListener {
  constructor(private readonly xp: XpService) {}

  @On('messageCreate')
  public async onMessage(@Context() [message]: ContextOf<'messageCreate'>) {
    if (message.author.bot || !message.inGuild()) return;
    await this.xp.handleMessage(message);
  }
}
