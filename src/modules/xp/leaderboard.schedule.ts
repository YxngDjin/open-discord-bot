/**
 * Whether the automatic leaderboard should be updated now.
 *
 * @param local        current date and time on the server, see localDateTime()
 * @param postTime     time set by the admin, e.g. "18:00"
 * @param lastPostedOn date of the last update, null if never posted
 */
export const isLeaderboardDue = (
  local: { date: string; time: string },
  postTime: string,
  lastPostedOn: string | null,
): boolean => {
  // "HH:MM" texts compare like times because both always have two digits.
  // >= instead of ===, so a missed minute (e.g. a restart) is caught up.
  // null !== date is true, so "never posted" counts as "not posted today".
  return local.time >= postTime && local.date !== lastPostedOn;
};
