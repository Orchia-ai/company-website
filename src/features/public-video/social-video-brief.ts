export const socialGoals = [
  { value: "audience", label: "Grow an audience", prompt: "What’s your next scroll-stopper?", placeholder: "A relatable moment, a surprising story, a hot take… Tell us what happens and why someone would share it.", direction: "Grow an audience with a shareable story and a strong opening hook." },
  { value: "product", label: "Sell a product", prompt: "What makes your product a must-have?", placeholder: "What are you selling? Who is it for? Show the problem it solves, the standout benefit, and what viewers should do next.", direction: "Introduce the product, demonstrate its benefit, and finish with a clear call to action. Use only product claims supplied in the brief." },
  { value: "business", label: "Promote a business", prompt: "Give people a reason to choose you.", placeholder: "Your business, your audience, your offer. Tell us what makes you different and how viewers can visit, book, or learn more.", direction: "Introduce the business and its offer with a strong opening and a clear next step. Use only business claims supplied in the brief." },
] as const;

export type SocialGoal = typeof socialGoals[number]["value"];
export const socialPlatforms = ["Reels", "TikTok", "Shorts"] as const;
export type SocialPlatform = typeof socialPlatforms[number];

/** User-selected creative direction travels through the existing context contract. */
export function buildSocialVideoBrief(description: string, title: string, goal: SocialGoal, platform: SocialPlatform) {
  const script = description.trim();
  const selected = socialGoals.find(item => item.value === goal) ?? socialGoals[0];
  return {
    title: title.trim() || automaticTitle(script),
    context: `${script}\n\nSocial video direction:\nGoal: ${selected.direction}\nPrimary platform: ${platform}.\nFollow the supplied story, language, and creative instructions.`,
  };
}

function automaticTitle(script: string) {
  const firstLine = script.split(/\r?\n/u).find(Boolean) ?? "My social video";
  const encoder = new TextEncoder();
  let title = "";
  let bytes = 0;
  // The existing public API bounds titles by UTF-8 bytes, including CJK and emoji.
  for (const character of firstLine) {
    const size = encoder.encode(character).length;
    if (bytes + size > 180 || title.length + character.length > 80) break;
    title += character;
    bytes += size;
  }
  return title.trim();
}
