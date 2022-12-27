export const ping = async () => {
  const a = await fetch("https://dany.dev");
  return a.status;
};
