import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, type SlashCommandContext } from 'necord';

@Injectable()
export class UtilityCommands {
  @SlashCommand({ name: 'ping', description: 'Fires back a Pong.' })
  public async onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply(`Pong! 🏓 ${interaction.client.ws.ping}`);
  }
}
