import { NewsItem, UserRole, Villager, GalleryItem, Donation } from './types';

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Geleneksel Yayla Şenliği',
    content: 'Bu yılki yayla şenliklerimiz Temmuz ayının ilk haftası başlayacaktır. Tüm köy halkı davetlidir.',
    date: '2023-06-15',
    author: 'Muhtar',
    imageUrl: 'https://picsum.photos/id/10/800/600'
  },
  {
    id: '2',
    title: 'Su Kesintisi Uyarısı',
    content: 'Köy deposunda yapılacak bakım nedeniyle Salı günü 12:00-14:00 arası su verilemeyecektir.',
    date: '2023-06-20',
    author: 'Muhtar'
  }
];

export const INITIAL_VILLAGERS: Villager[] = [
  {
    id: '101',
    name: 'Mehmet',
    surname: 'Yılmaz',
    role: UserRole.VILLAGER,
    email: 'mehmet@koy.com',
    profession: 'Tesisatçı',
    address: 'Çınar Sokak No: 5',
    contact: '0555 111 22 33',
    nickname: 'Sarı Mehmet',
    rating: 4
  },
  {
    id: '102',
    name: 'Ayşe',
    surname: 'Demir',
    role: UserRole.VILLAGER,
    email: 'ayse@koy.com',
    profession: 'Terzi',
    address: 'Meydan Caddesi No: 12',
    contact: '0555 444 55 66',
    rating: 5
  },
  {
    id: '103',
    name: 'Hasan',
    surname: 'Kara',
    role: UserRole.VILLAGER,
    email: 'hasan@koy.com',
    profession: 'Elektrikçi',
    address: 'Yokuşbaşı Mevkii',
    contact: '0555 777 88 99',
    nickname: 'Hızlı Hasan',
    rating: 3
  },
  {
    id: '104',
    name: 'Fatma',
    surname: 'Öztürk',
    role: UserRole.VILLAGER,
    email: 'fatma@koy.com',
    profession: 'Süt Ürünleri / Peynirci',
    address: 'Aşağı Mahalle No: 3',
    contact: '0555 222 33 44',
    rating: 5
  },
  {
    id: '105',
    name: 'Cemal',
    surname: 'Gürses',
    role: UserRole.VILLAGER,
    email: 'cemal@koy.com',
    profession: 'Marangoz',
    address: 'Orman Yolu No: 8',
    contact: '0555 888 77 66',
    nickname: 'Tahta Cemal',
    rating: 4
  },
  {
    id: '106',
    name: 'Sevim',
    surname: 'Kaya',
    role: UserRole.VILLAGER,
    email: 'sevim@koy.com',
    profession: 'Dokuma & El İşleri',
    address: 'Dere Kenarı No: 14',
    contact: '0555 333 99 00',
    rating: 5
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'g1',
    type: 'image',
    url: 'https://picsum.photos/id/28/800/600',
    caption: 'Köy Meydanı Sonbahar',
    date: '2023-10-15'
  },
  {
    id: 'g2',
    type: 'image',
    url: 'https://picsum.photos/id/57/800/600',
    caption: 'Eski Değirmen',
    date: '2023-09-01'
  },
  {
    id: 'g3',
    type: 'video',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    caption: 'Köy Deresi',
    date: '2023-08-20'
  }
];

export const INITIAL_DONATIONS: Donation[] = [
  {
    id: 'd1',
    donorName: 'Ahmet Yılmaz (Muhtar)',
    amount: 5000,
    date: '2023-11-01'
  },
  {
    id: 'd2',
    donorName: 'Anonim',
    amount: 1000,
    date: '2023-11-05'
  },
  {
    id: 'd3',
    donorName: 'Hacı Veli',
    amount: 2500,
    date: '2023-11-10'
  }
];
