import { ImageDomain } from '../types';

export const imageDomains: ImageDomain[] = [
  {
    slug: 'professional-scenes',
    emoji: '💼',
    title: 'Professional Scenes',
    description: 'Boardrooms, presentations, and collaborative workplace moments to sharpen formal communication.',
    accentClass: 'domain-card-accent-azure',
    imageAccentClass: 'domain-image-accent-azure',
    images: [
      {
        id: 'professional-meeting-roundtable',
        src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Team collaborating around a table in a modern conference room',
      },
      {
        id: 'professional-handshake',
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Business partners greeting each other with a handshake in the lobby',
      },
      {
        id: 'professional-presentation',
        src: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1600&q=80',
        alt: 'Presenter sharing a slide deck with colleagues during a meeting',
      },
      {
        id: 'professional-strategy-session',
        src: 'https://images.unsplash.com/photo-1522252234503-e356532cafd5?auto=format&fit=crop&w=1600&q=80',
        alt: 'Creative team mapping ideas on a glass wall in an office',
      },
    ],
  },
  {
    slug: 'emotions-expression',
    emoji: '🎭',
    title: 'Emotions & Expression',
    description: 'Close-up human portraits capturing subtle emotions, reactions, and storytelling through expression.',
    accentClass: 'domain-card-accent-blush',
    imageAccentClass: 'domain-image-accent-blush',
    images: [
      {
        id: 'expression-joyful-portrait',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Woman smiling brightly against a dark backdrop',
      },
      {
        id: 'expression-contemplative',
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person looking thoughtful with dramatic lighting across their face',
      },
      {
        id: 'expression-laughter',
        src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
        alt: 'Friends laughing together in a casual setting',
      },
      {
        id: 'expression-energy',
        src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Man celebrating with expressive hand gestures outdoors',
      },
    ],
  },
  {
    slug: 'nature-environment',
    emoji: '🌿',
    title: 'Nature & Environment',
    description: 'Immersive outdoor scenes filled with landscapes, textures, and serene natural ambiance.',
    accentClass: 'domain-card-accent-emerald',
    imageAccentClass: 'domain-image-accent-emerald',
    images: [
      {
        id: 'nature-forest-mist',
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
        alt: 'Sunlight streaming through a dense forest canopy',
      },
      {
        id: 'nature-mountain-lake',
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80',
        alt: 'Snow-capped mountains reflecting on a calm alpine lake',
      },
      {
        id: 'nature-desert-dunes',
        src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80',
        alt: 'Sweeping sand dunes with gentle shadows at sunset',
      },
      {
        id: 'nature-waterfall',
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80',
        alt: 'Lush waterfall cascading into a tranquil pool',
      },
    ],
  },
  {
    slug: 'technology-innovation',
    emoji: '🚀',
    title: 'Technology & Innovation',
    description: 'Futuristic labs, hardware builds, and digital workspaces capturing modern innovation.',
    accentClass: 'domain-card-accent-electric',
    imageAccentClass: 'domain-image-accent-electric',
    images: [
      {
        id: 'technology-robotics-lab',
        src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
        alt: 'Engineer working on a robotic arm inside a lab',
      },
      {
        id: 'technology-collaboration',
        src: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80',
        alt: 'Team collaborating with laptops and digital tablets',
      },
      {
        id: 'technology-server-room',
        src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Technician inspecting servers in a neon-lit data center',
      },
      {
        id: 'technology-prototype',
        src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&q=80',
        alt: 'Designer assembling components of a hardware prototype',
      },
    ],
  },
  {
    slug: 'places-architecture',
    emoji: '🏙',
    title: 'Places & Architecture',
    description: 'Cityscapes, cultural landmarks, and architectural marvels to inspire location-focused stories.',
    accentClass: 'domain-card-accent-amber',
    imageAccentClass: 'domain-image-accent-amber',
    images: [
      {
        id: 'places-modern-city',
        src: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80',
        alt: 'Illuminated skyline of a modern city at dusk',
      },
      {
        id: 'places-historic-archway',
        src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1600&q=80',
        alt: 'Historic stone archway leading into a courtyard',
      },
      {
        id: 'places-urban-bridge',
        src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80',
        alt: 'Suspension bridge disappearing into fog',
      },
      {
        id: 'places-cultural-site',
        src: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1600&q=80',
        alt: 'Colorful architecture of a historic cultural site',
      },
    ],
  },
  {
    slug: 'art-creativity',
    emoji: '🎨',
    title: 'Art & Creativity',
    description: 'Studios, craft sessions, and imaginative compositions that amplify creative storytelling.',
    accentClass: 'domain-card-accent-magenta',
    imageAccentClass: 'domain-image-accent-magenta',
    images: [
      {
        id: 'art-painting-studio',
        src: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80',
        alt: 'Artist mixing paints in a sunlit studio',
      },
      {
        id: 'art-creative-desk',
        src: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Desk covered with sketches, color swatches, and creative tools',
      },
      {
        id: 'art-clay-workshop',
        src: 'https://images.unsplash.com/photo-1527254059240-1f7e7d05b4e0?auto=format&fit=crop&w=1600&q=80',
        alt: 'Potter shaping clay on a spinning wheel',
      },
      {
        id: 'art-light-installation',
        src: 'https://images.unsplash.com/photo-1531665466865-7f30e61b1602?auto=format&fit=crop&w=1600&q=80',
        alt: 'Abstract light installation in a gallery',
      },
    ],
  },
  {
    slug: 'human-stories',
    emoji: '👶',
    title: 'Human Stories',
    description: 'Personal narratives, everyday connections, and life moments filled with warmth and depth.',
    accentClass: 'domain-card-accent-coral',
    imageAccentClass: 'domain-image-accent-coral',
    images: [
      {
        id: 'stories-family-time',
        src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Family sitting together sharing a joyful moment',
      },
      {
        id: 'stories-caregiving',
        src: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1600&q=80',
        alt: 'Caregiver supporting an elderly person during a walk',
      },
      {
        id: 'stories-celebration',
        src: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1600&q=80',
        alt: 'Friends celebrating with sparklers during the evening',
      },
      {
        id: 'stories-kindness',
        src: 'https://images.unsplash.com/photo-1470843810958-2da815d0e041?auto=format&fit=crop&w=1600&q=80',
        alt: 'Two people sharing a light-hearted conversation outdoors',
      },
    ],
  },
  {
    slug: 'dream-fantasy',
    emoji: '🌈',
    title: 'Dream & Fantasy',
    description: 'Surreal atmospheres, neon palettes, and ethereal worlds for imaginative storytelling.',
    accentClass: 'domain-card-accent-violet',
    imageAccentClass: 'domain-image-accent-violet',
    images: [
      {
        id: 'fantasy-neon-city',
        src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80',
        alt: 'Neon-lit futuristic cityscape at night',
      },
      {
        id: 'fantasy-aurora',
        src: 'https://images.unsplash.com/photo-1500534314209-92ad3ebb6329?auto=format&fit=crop&w=1600&q=80',
        alt: 'Aurora dancing across the sky over calm waters',
      },
      {
        id: 'fantasy-dreamscape',
        src: 'https://images.unsplash.com/photo-1517816825585-142f1e4ec332?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person standing under a surreal star-filled night sky',
      },
      {
        id: 'fantasy-floating-lanterns',
        src: 'https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Floating lanterns illuminating a dreamy festival scene',
      },
    ],
  },
];
