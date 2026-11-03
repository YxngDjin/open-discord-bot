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
  return template
    .replace(/{user}/g, values.user)
    .replace(/{username}/g, values.username)
    .replace(/{server}/g, values.server)
    .replace(/{memberCount}/g, values.memberCount.toString());
};
