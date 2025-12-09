export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  thumbnail?: string;
}

export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  videos: Video[];
}

export const locations: Location[] = [
  {
    id: 'turkey',
    name: 'Turkey',
    latitude: 39.9334,
    longitude: 32.8597,
    videos: [
      {
        id: 'turkey-1',
        title: 'Trip to Turkey',
        youtubeUrl: 'https://youtube.com/shorts/qWpf7Ht2_jE?si=NMWkw-isG6oTyMp1',
      },
      {
        id: 'turkey-2',
        title: 'Istanbul, Turkey Trip Recap',
        youtubeUrl: 'https://youtube.com/shorts/5UkwSk8PEVk?si=yKk07mlJD4ga-w4X',
      },
      {
        id: 'turkey-3',
        title: 'Turkey Trip Itinerary and Planning',
        youtubeUrl: 'https://youtu.be/P5dvAEe75vY?feature=shared',
      },
      {
        id: 'turkey-4',
        title: 'Cappadocia, Turkey',
        youtubeUrl: 'https://youtube.com/shorts/LQqzW7C5BmE?si=yg7xUN_-AOm7uogy',
      }
    ]
  },
  {
    id: 'morocco',
    name: 'Morocco',
    latitude: 31.6295,
    longitude: -7.9811,
    videos: [
      {
        id: 'morocco-1',
        title: 'Chefchaouan, Morocco',
        youtubeUrl: 'https://youtube.com/shorts/zIde5Nt8-fY?si=ttlxVX-591x7MgCy',
      }
    ]
  },
  {
    id: 'greece',
    name: 'Greece',
    latitude: 39.0742,
    longitude: 21.8243,
    videos: [
      {
        id: 'greece-1',
        title: 'Athens, Greece Trip Recap',
        youtubeUrl: 'https://youtube.com/shorts/CaGoy6gwguY?si=RdZeOTuSalN-v9-f',
      },
      {
        id: 'greece-2',
        title: 'Athens, Greece Itinerary',
        youtubeUrl: 'https://youtube.com/shorts/E4nME5XzVR8?si=NQfzibQgUIOSJj3-',
      }
    ]
  },
  {
    id: 'belgium',
    name: 'Belgium',
    latitude: 50.8503,
    longitude: 4.3517,
    videos: [
      {
        id: 'belgium-1',
        title: 'Belgium Trip Recap',
        youtubeUrl: 'https://youtube.com/shorts/VFjvpcY8new?si=P5x6fXmVGymt6ZcB',
      }
    ]
  },
  {
    id: 'taiwan',
    name: 'Taiwan',
    latitude: 23.6978,
    longitude: 120.9605,
    videos: [
      {
        id: 'taiwan-1',
        title: 'Grad to Taiwan!',
        youtubeUrl: 'https://youtube.com/shorts/HyFRjMVGd4g?si=BIDH4ylSaWhlhevd',
      },
      {
        id: 'taiwan-2',
        title: 'Taiwanese Food!',
        youtubeUrl: 'https://youtube.com/shorts/qCJgHLoCfsA?si=rWQd_rih9VOV1Op5',
      },
      {
        id: 'taiwan-3',
        title: 'Black in Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/RCzAKJOoLmM?si=QLqJBWHMqnXbRyCr',
      },
      {
        id: 'taiwan-4',
        title: 'Semiconductor Industry in Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/HXH1nMg4vw8?si=uJDe17b-HX5eK3XT',
      },
      {
        id: 'taiwan-5',
        title: 'Taiwanese History',
        youtubeUrl: 'https://youtube.com/shorts/dUJa6cq-Mg0?si=aHy0YU8H_GEn9YHa',
      },
      {
        id: 'taiwan-6',
        title: "Taiwan's Political Parties",
        youtubeUrl: 'https://youtube.com/shorts/-QTE24xcnpY?si=Z0n2yr-8skqOpjWw',
      },
      {
        id: 'taiwan-7',
        title: 'Travel Tips for Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/BNNqZNDht08?si=Xj21exnXC1pkCv2F',
      },
      {
        id: 'taiwan-8',
        title: 'Multiculturalism of Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/Wktp7r4DsQ4?si=FsulCIJGXoujqA5i',
      },
      {
        id: 'taiwan-9',
        title: 'Jiufen, Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/Q2KzHN_5wBY?si=pWSTE82UUFpOVd-6',
      },
      {
        id: 'taiwan-10',
        title: 'Indigenous Tribes of Taiwan',
        youtubeUrl: 'https://youtube.com/shorts/p_y0IT1m-js?si=H54mrAswxlyNHvKw',
      }
    ]
  },
  {
    id: 'france',
    name: 'France',
    latitude: 46.2276,
    longitude: 2.2137,
    videos: [
      {
        id: 'france-1',
        title: 'Marseille, South of France',
        youtubeUrl: 'https://youtube.com/shorts/MLPDe2kWqaQ?si=AEPsKuggVef-5Muc',
      },
      {
        id: 'france-2',
        title: 'What I Did in Marseille, France',
        youtubeUrl: 'https://youtube.com/shorts/Bjl8MpsRr2s?si=ksbp1V0gOW2GiEYT',
      }
    ]
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    latitude: 55.3781,
    longitude: -3.4360,
    videos: [
      {
        id: 'uk-1',
        title: 'UK Weekend Trip',
        youtubeUrl: 'https://youtube.com/shorts/JnaqS3i5o50?si=-iqkGKUrTfJraLFE',
      }
    ]
  },
  {
    id: 'brazil',
    name: 'Brazil',
    latitude: -14.2350,
    longitude: -51.9253,
    videos: [
      {
        id: 'brazil-1',
        title: 'This Is Your Sign to Visit Rio',
        youtubeUrl: 'https://youtube.com/shorts/Vz8nlvyvYVM?si=uWu8QNlLsscCKGQy',
      },
      {
        id: 'brazil-2',
        title: 'Agenda from My Trip to Rio',
        youtubeUrl: 'https://youtube.com/shorts/yqdiLGs8U4I?si=oLBC0AjEhgujOHLp',
      },
      {
        id: 'brazil-3',
        title: 'Little Africa Walking Tour in Rio',
        youtubeUrl: 'https://youtube.com/shorts/G_n6teksrkk?si=VPc0Vb7WYkLuYaNZ',
      },
      {
        id: 'brazil-4',
        title: 'Safety Guide to Rio as a Woman',
        youtubeUrl: 'https://youtube.com/shorts/psj0lP9JpfA?si=tROW25aen1JrGykj',
      }
    ]
  },
  {
    id: 'ethiopia',
    name: 'Ethiopia',
    latitude: 9.1450,
    longitude: 40.4897,
    videos: [
      // Videos removed because they used placeholder URLs
    ]
  },
  {
    id: 'panama',
    name: 'Panama',
    latitude: 8.5380,
    longitude: -80.7821,
    videos: [
      // Videos removed because they used placeholder URLs
    ]
  }
];
