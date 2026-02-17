export enum UserRole {
  GUEST = 'GUEST',
  VILLAGER = 'VILLAGER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  surname: string;
  role: UserRole;
  email?: string;
}

export interface Villager extends User {
  role: UserRole.VILLAGER;
  nickname?: string;
  profession: string;
  address: string;
  contact: string;
  rating: number; // 0-5 stars
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  author_id?: string;
  image_url?: string;
  imageUrl?: string; // Kept for frontend compatibility, mapped from image_url
}

export interface EventItem {
  id: string;
  title: string;
  content: string;
  date: string;
  startDate?: string;
  endDate?: string;
  author: string;
  author_id?: string;
  image_url?: string;
  imageUrl?: string; // Kept for frontend compatibility
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: string;
}

export interface Donation {
  id: string;
  donorName: string; // "Anonim" if not provided
  amount: number;
  date: string;
}

export type AnyUser = User | Villager;
