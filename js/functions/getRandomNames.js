export const getRandomNames = async (count) => {
  const API = `http://names.drycodes.com/${count}?format=json`;
  const PROXY = "https://cors-anywhere.herokuapp.com/";

  try {
    const response = await fetch(`${PROXY}${API}`);
    if (response.ok) return await response.json();
    else return staticNames(count);
  } catch {
    return staticNames(count);
  }
};

const staticNames = (count) => {
  const names = [];

  for (let i = 0; i < count; i++) {
    names.push(`Bot ${i + 1}`);
  }

  return names;
};
