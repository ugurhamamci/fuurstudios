/** Ad girilmediyse baş harfleri isimden üretir: "Uğur Yılmaz" -> "UY" */
export const initialsFrom = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

export type TeamMemberInput = ReturnType<typeof readTeamForm>;

/** Ekip üyesi alanlarını FormData'dan okuyup temizler. */
export const readTeamForm = (formData: FormData) => {
  const name = ((formData.get('name') as string) || '').trim();
  const initials = ((formData.get('initials') as string) || '').trim().slice(0, 3).toUpperCase();

  return {
    name,
    role: ((formData.get('role') as string) || '').trim(),
    bio: ((formData.get('bio') as string) || '').trim(),
    initials: initials || initialsFrom(name),
    accent_color: ((formData.get('accent_color') as string) || '#C8102E').trim(),
    linkedin_url: ((formData.get('linkedin_url') as string) || '').trim(),
    instagram_url: ((formData.get('instagram_url') as string) || '').trim(),
    github_url: ((formData.get('github_url') as string) || '').trim(),
    twitter_url: ((formData.get('twitter_url') as string) || '').trim(),
    whatsapp: ((formData.get('whatsapp') as string) || '').replace(/[^0-9]/g, ''),
    sort_order: Number(formData.get('sort_order') ?? 0) || 0,
  };
};
