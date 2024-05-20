export const dressLikeCelebPrompt = (
  celebrityName: string,
  celebStyleData: string,
  existingWardrobe: string
) =>
  `Show me 8 ways to dress like the ${celebrityName} using items from my existing wardrobe. I’ve provided information about the ${celebrityName}’s  style and the wardrobe below. 
Celebrity Style Data:  ${celebStyleData}
Existing Wardrobe ${existingWardrobe}`;
