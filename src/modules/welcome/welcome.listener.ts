import { Injectable, Logger } from '@nestjs/common';
import { WelcomeService } from './welcome.service.js';
import { Context, type ContextOf, On } from 'necord';

@Injectable()
export class WelcomeListener {
  private readonly logger = new Logger(WelcomeListener.name);

  constructor(private readonly welcomeService: WelcomeService) {}

  @On('guildMemberAdd')
  public async onGuildMemberAdd(
    @Context() [member]: ContextOf<'guildMemberAdd'>,
  ) {
    await this.welcomeService.handleJoin(member);
  }

  @On('guildMemberRemove')
  public async onGuildMemberRemove(
    @Context() [member]: ContextOf<'guildMemberRemove'>,
  ) {
    await this.welcomeService.handleLeave(member);
  }
}
