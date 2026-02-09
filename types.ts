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
  imageUrl?: string;
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
