/** Centralized social media configuration for VisitVagad */

export interface SocialLink {
  name: string;
  url: string;
  icon: 'instagram' | 'facebook' | 'youtube' | 'twitter';
}

export const SOCIALS: SocialLink[] = [
  { name: 'Instagram', url: 'https://www.instagram.com/visitvagad', icon: 'instagram' },
  { name: 'Facebook', url: 'https://www.facebook.com/visitvagad', icon: 'facebook' },
  { name: 'YouTube', url: 'https://www.youtube.com/@visitvagad', icon: 'youtube' },
  { name: 'Twitter', url: 'https://x.com/visitvagad', icon: 'twitter' },
];
