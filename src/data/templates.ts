export interface Template {
  id: string;
  name: string;
  tagline: string;
  route: string;
  colors: string[];
  tags: string[];
  available: boolean;
}

export const templates: Template[] = [
  {
    id: 'songket',
    name: 'Songket Manuscript',
    tagline: 'Warisan Melayu. Pelaksanaan Sinematik.',
    route: '/songket/',
    colors: ['#071D18', '#D9B867', '#174D3D', '#F7F0DF'],
    tags: ['Malay Heritage', 'Cinematic', 'Ceremonial'],
    available: true,
  },
  {
    id: 'noir',
    name: 'Quiet Luxury',
    tagline: 'Keanggunan dalam kesederhanaan.',
    route: '/noir/',
    colors: ['#FAF8F5', '#C5A55A', '#2C2C2C', '#E8C4B8'],
    tags: ['Modern', 'Minimal', 'Editorial'],
    available: true,
  },
  {
    id: 'garden',
    name: 'Ethereal Garden',
    tagline: 'Romantis, bermusim, penuh kehidupan.',
    route: '/garden/',
    colors: ['#8FA98A', '#E8C4B8', '#C5B8D4', '#D4A843'],
    tags: ['Botanical', 'Romantic', 'Pastel'],
    available: true,
  },
];
