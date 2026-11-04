import { Injectable } from '@nestjs/common';
import { Context, type ContextOf, On } from 'necord';
import { ModlogService } from './modlog.service.js';

@Injectable()
export class ModlogListener {
  constructor(private readonly modlog: ModlogService) {}

  @On('guildMemberAdd')
  public async onMemberAdd(@Context() [member]: ContextOf<'guildMemberAdd'>) {
    await this.modlog.logJoin(member);
  }

  @On('guildMemberRemove')
  public async onMemberRemove(
    @Context() [member]: ContextOf<'guildMemberRemove'>,
  ) {
    await this.modlog.logLeave(member);
  }
}
