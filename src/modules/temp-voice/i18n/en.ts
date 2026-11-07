import type { OwnedChannelError } from '../temp-voice.service.js';

/** Why /voice can't be used, one text per result of getOwnedChannel. */
const errors: Record<OwnedChannelError, string> = {
  not_in_voice: '❌ Join your temporary voice channel first.',
  not_temp: '❌ This is not a temporary voice channel.',
  not_owner: '❌ Only the owner of this channel can change it.',
};

export const en = {
  // /tempvoice (admin, user language)
  admin: {
    show: {
      title: 'Temporary voice channels',
      creatorChannel: 'Join to create',
      category: 'Category',
      sameAsCreator: 'same as the join channel',
      nameTemplate: 'Channel name',
      userLimit: 'User limit',
      noLimit: 'no limit',
      deleteAfter: 'Delete when empty after',
      minutes: (params: { minutes: number }) =>
        params.minutes === 0 ? 'right away' : `${params.minutes} min`,
      notSet: 'not set',
    },
    channelSet: (params: { channel: string }) =>
      `✅ Members who join ${params.channel} now get their own voice channel.`,
    channelRemoved:
      '✅ Join channel removed. No new temporary channels will be created.',
    missingPermissions:
      '⚠️ I am missing the **Manage Channels** or **Move Members** permission. Without them I cannot create channels or move members.',
    categorySet: (params: { category: string }) =>
      `✅ New channels will be created in ${params.category}.`,
    categoryRemoved:
      '✅ New channels will be created in the same category as the join channel.',
    nameSet: (params: { example: string }) =>
      `✅ Channel name updated. Example: **${params.example}**`,
    limitSet: (params: { limit: number }) =>
      params.limit === 0
        ? '✅ New channels have no user limit.'
        : `✅ New channels are limited to ${params.limit} users.`,
    deleteAfterSet: (params: { minutes: number }) =>
      params.minutes === 0
        ? '✅ Empty channels are deleted right away (within a minute).'
        : `✅ Empty channels are deleted after ${params.minutes} minute(s).`,
  },

  // /voice (channel owner, user language)
  owner: {
    errors,
    renamed: (params: { name: string }) =>
      `✅ Channel renamed to **${params.name}**.`,
    limitSet: (params: { limit: number }) =>
      params.limit === 0
        ? '✅ Your channel has no user limit now.'
        : `✅ Your channel is limited to ${params.limit} users now.`,
    locked: '🔒 Your channel is locked. Nobody else can join.',
    unlocked: '🔓 Your channel is open again.',
    failed:
      "❌ I couldn't change your channel. I might be missing the Manage Channels permission.",
  },
};

export type TempVoiceTranslations = typeof en;
