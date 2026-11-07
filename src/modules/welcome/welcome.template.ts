export type TemplateValues = {
  user: string;
  username: string;
  server: string;
  memberCount: number;
};

export const renderTemplate = (
  template: string,
  values: TemplateValues,
): string => {
  // Functions instead of strings as replacement: with a string, patterns like
  // "$&" in a name would be treated as special replace patterns.
  return template
    .replace(/{user}/g, () => values.user)
    .replace(/{username}/g, () => values.username)
    .replace(/{server}/g, () => values.server)
    .replace(/{memberCount}/g, () => values.memberCount.toString());
};
