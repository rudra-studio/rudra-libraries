import React, { useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';

type SmileyyfyWidgetCategory = 'text' | 'invitation' | 'proposal' | 'animate' | 'media';

type StorySpriteScene =
  | 'couple_hands'
  | 'baby_walk'
  | 'ring_sparkle'
  | 'dancing_hearts'
  | 'cake_celebration'
  | 'custom_sprite';

type FloatingStyleType =
  | 'hearts'
  | 'sparkles'
  | 'petals'
  | 'confetti'
  | 'butterflies'
  | 'baby'
  | 'lanterns'
  | 'diyas'
  | 'ocean'
  | 'leaves'
  | 'party'
  | 'festive';

type SurfaceKeyType =
  | 'blush'
  | 'starlit'
  | 'emerald'
  | 'golden'
  | 'lavender'
  | 'pastel'
  | 'sunset'
  | 'ivory'
  | 'maroon'
  | 'coastal'
  | 'sage'
  | 'neon'
  | 'peacock'
  | 'champagne';

type StarterPresetType = 'proposal' | 'invitation' | 'birthday' | 'anniversary' | 'baby_shower';

interface SmileyyfyLanguageOption {
  code: string;
  label: string;
}

interface SmileyyfyBaseTemplate {
  id: string;
  name: string;
  badge: string;
  floatingStyle: FloatingStyleType;
  surfaceKey: SurfaceKeyType;
  description: string;
}

interface SmileyyfyWidgetField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select' | 'boolean';
  placeholder?: string;
  translatable?: boolean;
  options?: { value: string; label: string }[];
}

interface SmileyyfyWidgetDefinition {
  type: string;
  category: SmileyyfyWidgetCategory;
  name: string;
  icon: string;
  summary: string;
  defaultData: Record<string, string | boolean>;
  defaultTranslations?: Record<string, Record<string, string>>;
  fields: SmileyyfyWidgetField[];
}

interface SmileyyfyCanvasBlock {
  id: string;
  type: string;
  data: Record<string, string | boolean>;
  translations?: Record<string, Record<string, string>>;
}

interface SmileyyfyPageSnapshot {
  templateId: string;
  defaultLanguage: string;
  languages: SmileyyfyLanguageOption[];
  blocks: SmileyyfyCanvasBlock[];
}

interface PageCanvasBuilderProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @select|proposal|invitation|birthday|anniversary|baby_shower */
  starterPreset?: StarterPresetType;
  /** @type|json */
  initialLanguages?: SmileyyfyLanguageOption[];
  /** @type|json */
  customWidgets?: SmileyyfyWidgetDefinition[];
  /** @type|json */
  customTemplates?: SmileyyfyBaseTemplate[];
  /** @type|function */
  onSavePage?: (pageSnapshot: SmileyyfyPageSnapshot) => void;
}

const DEFAULT_LANGUAGES: SmileyyfyLanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
];

const SUGGESTED_LANGUAGES: SmileyyfyLanguageOption[] = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' },
];

const DEFAULT_BASE_TEMPLATES: SmileyyfyBaseTemplate[] = [
  {
    id: 'tpl_blush_hearts',
    name: 'Blush Floating Hearts',
    badge: '💖 Romance',
    floatingStyle: 'hearts',
    surfaceKey: 'blush',
    description: 'Soft rose-petal gradient with gentle rising hearts.',
  },
  {
    id: 'tpl_royal_maroon',
    name: 'Royal Crimson & Gold',
    badge: '👑 Traditional',
    floatingStyle: 'diyas',
    surfaceKey: 'maroon',
    description: 'Regal wedding maroon with warm gold accents & glowing diyas.',
  },
  {
    id: 'tpl_emerald_sparkles',
    name: 'Royal Emerald Sparkles',
    badge: '💍 Wedding',
    floatingStyle: 'sparkles',
    surfaceKey: 'emerald',
    description: 'Rich wedding emerald with shimmering gold sparkles.',
  },
  {
    id: 'tpl_champagne_noir',
    name: 'Champagne Gala Noir',
    badge: '🥂 Gala',
    floatingStyle: 'sparkles',
    surfaceKey: 'champagne',
    description: 'Luxury obsidian & champagne gold for black-tie receptions & anniversaries.',
  },
  {
    id: 'tpl_coastal_breeze',
    name: 'Coastal Beach Sunset',
    badge: '🌴 Destination',
    floatingStyle: 'ocean',
    surfaceKey: 'coastal',
    description: 'Breezy ocean turquoise & warm sand for beach destination invites.',
  },
  {
    id: 'tpl_garden_botanical',
    name: 'Sage Botanical Garden',
    badge: '🌿 Garden',
    floatingStyle: 'leaves',
    surfaceKey: 'sage',
    description: 'Fresh eucalyptus & botanical sage for outdoor garden celebrations.',
  },
  {
    id: 'tpl_peacock_festive',
    name: 'Peacock Marigold Festive',
    badge: '🦚 Festive',
    floatingStyle: 'festive',
    surfaceKey: 'peacock',
    description: 'Vibrant marigold & teal palette for haldi, mehendi & housewarmings.',
  },
  {
    id: 'tpl_neon_party',
    name: 'Midnight Neon Bash',
    badge: '🪩 Party',
    floatingStyle: 'party',
    surfaceKey: 'neon',
    description: 'Electric violet nightlife glow for birthdays, sangeet & cocktail nights.',
  },
  {
    id: 'tpl_starlit_petals',
    name: 'Starlit Velvet Petals',
    badge: '🌌 Evening',
    floatingStyle: 'petals',
    surfaceKey: 'starlit',
    description: 'Deep midnight velvet with drifting rose petals.',
  },
  {
    id: 'tpl_golden_confetti',
    name: 'Golden Celebration Confetti',
    badge: '🎉 Festive',
    floatingStyle: 'confetti',
    surfaceKey: 'golden',
    description: 'Warm sunlit gold with celebratory floating confetti.',
  },
  {
    id: 'tpl_lavender_butterflies',
    name: 'Lavender Dream Butterflies',
    badge: '🦋 Dreamy',
    floatingStyle: 'butterflies',
    surfaceKey: 'lavender',
    description: 'Soft lilac sky with fluttering butterflies and sparkles.',
  },
  {
    id: 'tpl_pastel_baby',
    name: 'Pastel Baby Clouds',
    badge: '🍼 Baby',
    floatingStyle: 'baby',
    surfaceKey: 'pastel',
    description: 'Sky-blue & buttercream pastel with baby footprints and stars.',
  },
  {
    id: 'tpl_sunset_lanterns',
    name: 'Sunset Glow Lanterns',
    badge: '🏮 Warm',
    floatingStyle: 'lanterns',
    surfaceKey: 'sunset',
    description: 'Warm sunset peach with floating glowing lanterns.',
  },
  {
    id: 'tpl_ivory_floral',
    name: 'Minimal Ivory Floral',
    badge: '🌸 Classic',
    floatingStyle: 'petals',
    surfaceKey: 'ivory',
    description: 'Clean editorial ivory paper with subtle floating petals.',
  },
];

const DEFAULT_WIDGET_REGISTRY: SmileyyfyWidgetDefinition[] = [
  {
    type: 'text_banner',
    category: 'text',
    name: 'Title & Divider Banner',
    icon: '🖋️',
    summary: 'Expressive serif heading with subtle decorative ornament.',
    defaultData: {
      heading: 'Two Hearts, One Forever',
      subtext: 'We are so excited to share this special chapter with you.',
    },
    defaultTranslations: {
      ta: {
        heading: 'இரு இதயங்கள், ஒரே பயணம்',
        subtext: 'எங்கள் மகிழ்ச்சியான தருணத்தை உங்களுடன் பகிர்வதில் பெருமகிழ்ச்சி.',
      },
    },
    fields: [
      { key: 'heading', label: 'Headline', type: 'text', placeholder: 'Two Hearts, One Forever', translatable: true },
      { key: 'subtext', label: 'Subtext', type: 'textarea', placeholder: 'Optional short line', translatable: true },
    ],
  },
  {
    type: 'story_paragraph',
    category: 'text',
    name: 'Story Note Block',
    icon: '📝',
    summary: 'Clean narrative paragraph for your story, wishes, or schedule note.',
    defaultData: {
      title: 'Our Little Story',
      body: 'What began as a chance conversation over coffee turned into our favorite adventure. Thank you for being part of our journey.',
    },
    defaultTranslations: {
      ta: {
        title: 'எங்கள் அழகிய கதை',
        body: 'சிறு உரையாடலாகத் தொடங்கிய எங்கள் நட்பு இன்று அழகிய வாழ்க்கைப் பயணமாக மலர்ந்துள்ளது.',
      },
    },
    fields: [
      { key: 'title', label: 'Section Title', type: 'text', placeholder: 'Our Little Story', translatable: true },
      { key: 'body', label: 'Paragraph Text', type: 'textarea', placeholder: 'Write your story...', translatable: true },
    ],
  },
  {
    type: 'rich_quote',
    category: 'text',
    name: 'Romantic Quote Card',
    icon: '💬',
    summary: 'Highlighted quote block with author signature.',
    defaultData: {
      quote: '“In all the world, there is no heart for me like yours.”',
      author: 'Maya Angelou',
    },
    fields: [
      { key: 'quote', label: 'Quote', type: 'textarea', placeholder: 'Write a favorite quote...', translatable: true },
      { key: 'author', label: 'Author', type: 'text', placeholder: 'Author name', translatable: true },
    ],
  },
  {
    type: 'milestone_timeline',
    category: 'text',
    name: '3-Step Story Timeline',
    icon: '🕰️',
    summary: 'Three milestone moments in a clean vertical story trail.',
    defaultData: {
      step1Title: '2023 • First Hello ☕',
      step1Note: 'Met at a rainy evening café and talked for hours.',
      step2Title: '2025 • The Proposal 💍',
      step2Note: 'A sunset beach walk and the easiest YES ever.',
      step3Title: '2026 • The Big Day 🎉',
      step3Note: 'Celebrating forever with all our favorite people.',
    },
    fields: [
      { key: 'step1Title', label: 'Milestone 1', type: 'text', translatable: true },
      { key: 'step1Note', label: 'Note 1', type: 'text', translatable: true },
      { key: 'step2Title', label: 'Milestone 2', type: 'text', translatable: true },
      { key: 'step2Note', label: 'Note 2', type: 'text', translatable: true },
      { key: 'step3Title', label: 'Milestone 3', type: 'text', translatable: true },
      { key: 'step3Note', label: 'Note 3', type: 'text', translatable: true },
    ],
  },
  {
    type: 'hero_header',
    category: 'invitation',
    name: 'Event / Couple Header',
    icon: '✨',
    summary: 'Headline, couple or host names, and occasion badge.',
    defaultData: {
      badge: 'WEDDING INVITATION',
      names: 'Aarav & Meera',
      subtitle: 'Together with their families, invite you to celebrate',
    },
    defaultTranslations: {
      ta: {
        badge: 'திருமண அழைப்பிதழ்',
        names: 'ஆரவ் & மீரா',
        subtitle: 'குடும்பத்தாருடன் இணைந்து எங்கள் திருமண விழாவிற்கு அன்புடன் அழைக்கிறோம்',
      },
    },
    fields: [
      { key: 'badge', label: 'Top Badge', type: 'text', placeholder: 'WEDDING INVITATION', translatable: true },
      { key: 'names', label: 'Names / Headline', type: 'text', placeholder: 'Aarav & Meera', translatable: true },
      { key: 'subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Short welcome line', translatable: true },
    ],
  },
  {
    type: 'event_details',
    category: 'invitation',
    name: 'Date, Time & Venue',
    icon: '📍',
    summary: 'Clean schedule card with date, time, and location.',
    defaultData: {
      date: '2026-12-20',
      time: '06:30 PM',
      venue: 'The Lotus Pavilion, ECR, Chennai',
    },
    defaultTranslations: {
      ta: {
        time: 'மாலை 06:30 மணி',
        venue: 'தி லோட்டஸ் பெவிலியன், இ.சி.ஆர், சென்னை',
      },
    },
    fields: [
      { key: 'date', label: 'Date', type: 'date', translatable: false },
      { key: 'time', label: 'Time', type: 'text', placeholder: '06:30 PM', translatable: true },
      { key: 'venue', label: 'Venue / Address', type: 'text', placeholder: 'Venue name & city', translatable: true },
    ],
  },
  {
    type: 'countdown_timer',
    category: 'invitation',
    name: 'Live Event Countdown',
    icon: '⏳',
    summary: 'Live ticking Days, Hours, Mins & Seconds countdown to your big day.',
    defaultData: {
      label: 'Counting Down to the Celebration',
      targetDate: '2026-12-20',
    },
    defaultTranslations: {
      ta: {
        label: 'கொண்டாட்டத்திற்கான எண்ணிப்பார்ப்பு',
      },
    },
    fields: [
      { key: 'label', label: 'Countdown Title', type: 'text', placeholder: 'Counting Down...', translatable: true },
      { key: 'targetDate', label: 'Target Date', type: 'date', translatable: false },
    ],
  },
  {
    type: 'dress_code_card',
    category: 'invitation',
    name: 'Dress Code & Guest Tip',
    icon: '👗',
    summary: 'Share outfit theme, parking, or gift note in a neat pill card.',
    defaultData: {
      dressCode: 'Festive Pastel & Gold',
      note: 'Valet parking available at the main garden entrance.',
    },
    defaultTranslations: {
      ta: {
        dressCode: 'பட்டு மற்றும் வெளிர் நிற ஆடைகள்',
        note: 'பிரதான நுழைவாயிலில் வாகன நிறுத்துமிட வசதி உள்ளது.',
      },
    },
    fields: [
      { key: 'dressCode', label: 'Dress Code / Theme', type: 'text', placeholder: 'Festive Pastel & Gold', translatable: true },
      { key: 'note', label: 'Helpful Guest Tip', type: 'textarea', placeholder: 'Parking or arrival info...', translatable: true },
    ],
  },
  {
    type: 'rsvp_card',
    category: 'invitation',
    name: 'Optional RSVP Box',
    icon: '📋',
    summary: 'Quick guest RSVP form with optional toggle.',
    defaultData: {
      heading: 'Will You Join Us?',
      buttonLabel: 'Confirm RSVP',
      allowPlusOne: true,
    },
    defaultTranslations: {
      ta: {
        heading: 'எங்கள் விழாவில் கலந்துகொள்வீர்களா?',
        buttonLabel: 'வருகை உறுதி செய்',
      },
    },
    fields: [
      { key: 'heading', label: 'RSVP Heading', type: 'text', placeholder: 'Will You Join Us?', translatable: true },
      { key: 'buttonLabel', label: 'Button Label', type: 'text', placeholder: 'Confirm RSVP', translatable: true },
      { key: 'allowPlusOne', label: 'Allow Guest Count (+1)', type: 'boolean', translatable: false },
    ],
  },
  {
    type: 'love_letter',
    category: 'proposal',
    name: 'Love Letter Card',
    icon: '💌',
    summary: 'Heartfelt message block with sender signature.',
    defaultData: {
      greeting: 'Dear My Favorite Person,',
      body: 'Every smile, every quiet talk, and every adventure with you means the world to me.',
      signature: 'Forever Yours',
    },
    defaultTranslations: {
      ta: {
        greeting: 'என் அன்பானவளே,',
        body: 'உன்னுடன் கழிக்கும் ஒவ்வொரு சிரிப்பும், ஒவ்வொரு நொடியும் என் வாழ்க்கையின் மிக அழகான பரிசு.',
        signature: 'என்றென்றும் உன்னவன்',
      },
    },
    fields: [
      { key: 'greeting', label: 'Greeting', type: 'text', placeholder: 'Dear ...', translatable: true },
      { key: 'body', label: 'Message', type: 'textarea', placeholder: 'Write your heartfelt note...', translatable: true },
      { key: 'signature', label: 'Signature', type: 'text', placeholder: 'Forever Yours', translatable: true },
    ],
  },
  {
    type: 'photo_polaroids',
    category: 'proposal',
    name: 'Photo Memory Strip',
    icon: '📸',
    summary: 'Two tilted Polaroid photo cards with captions.',
    defaultData: {
      photoOneUrl: '',
      captionOne: 'Our First Date ☕',
      photoTwoUrl: '',
      captionTwo: 'Forever Together 💍',
    },
    defaultTranslations: {
      ta: {
        captionOne: 'முதல் சந்திப்பு ☕',
        captionTwo: 'என்றும் இணைந்தே 💍',
      },
    },
    fields: [
      { key: 'photoOneUrl', label: 'Photo 1 URL', type: 'url', placeholder: 'https://...', translatable: false },
      { key: 'captionOne', label: 'Caption 1', type: 'text', placeholder: 'Our First Date', translatable: true },
      { key: 'photoTwoUrl', label: 'Photo 2 URL', type: 'url', placeholder: 'https://...', translatable: false },
      { key: 'captionTwo', label: 'Caption 2', type: 'text', placeholder: 'Forever Together', translatable: true },
    ],
  },
  {
    type: 'flying_proposal',
    category: 'proposal',
    name: 'Flying "No" Button Prompt',
    icon: '💘',
    summary: 'Interactive proposal question where the No button flies away.',
    defaultData: {
      question: 'Will You Marry Me? 💖',
      yesLabel: 'Yes, Forever! 💖',
      noLabel: 'No 🙈',
      acceptedText: 'YAY!! Forever Begins Today! 💍🎉',
    },
    defaultTranslations: {
      ta: {
        question: 'என்னை திருமணம் செய்துகொள்வாயா? 💖',
        yesLabel: 'ஆம், என்றென்றும்! 💖',
        noLabel: 'இல்லை 🙈',
        acceptedText: 'அருமை!! நம் புதிய பயணம் இன்று தொடங்குகிறது! 💍🎉',
      },
    },
    fields: [
      { key: 'question', label: 'Proposal Question', type: 'text', placeholder: 'Will You Marry Me?', translatable: true },
      { key: 'yesLabel', label: 'Yes Button', type: 'text', placeholder: 'Yes, Forever!', translatable: true },
      { key: 'noLabel', label: 'Flying No Button', type: 'text', placeholder: 'No', translatable: true },
      { key: 'acceptedText', label: 'Celebration Message', type: 'text', placeholder: 'YAY!!', translatable: true },
    ],
  },
  {
    type: 'couple_hands_anim',
    category: 'animate',
    name: 'Couple Joining Hands',
    icon: '💑',
    summary: 'Animated couple walking together and joining hands with a heart burst.',
    defaultData: {
      scene: 'couple_hands',
      caption: 'Walking Hand in Hand Forever',
      leftEmoji: '🤵',
      rightEmoji: '👰',
    },
    defaultTranslations: {
      ta: {
        caption: 'கைகோர்த்து என்றும் இணைந்து நடப்போம்',
      },
    },
    fields: [
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Walking Hand in Hand Forever', translatable: true },
      { key: 'leftEmoji', label: 'Left Character Emoji', type: 'text', placeholder: '🤵', translatable: false },
      { key: 'rightEmoji', label: 'Right Character Emoji', type: 'text', placeholder: '👰', translatable: false },
    ],
  },
  {
    type: 'baby_walk_anim',
    category: 'animate',
    name: 'Baby Walk Animation',
    icon: '👶',
    summary: 'Playful waddling baby animation with cute footprints and sparkles.',
    defaultData: {
      scene: 'baby_walk',
      caption: 'Little Feet, Big Adventures Ahead!',
    },
    defaultTranslations: {
      ta: {
        caption: 'சிறு காலடிகள், பெரிய மகிழ்ச்சிகள்!',
      },
    },
    fields: [
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Little Feet, Big Adventures!', translatable: true },
    ],
  },
  {
    type: 'story_sprite_anim',
    category: 'animate',
    name: 'Story / Sprite Animator',
    icon: '🎭',
    summary: 'Pick Ring Sparkle, Dancing Couple, Birthday Cake, or custom sprite sheet.',
    defaultData: {
      scene: 'ring_sparkle',
      caption: 'A Sparkle Made for Forever',
      spriteSheetUrl: '',
    },
    fields: [
      {
        key: 'scene',
        label: 'Animation Scene',
        type: 'select',
        translatable: false,
        options: [
          { value: 'ring_sparkle', label: '💍 Ring Sparkle' },
          { value: 'dancing_hearts', label: '💃 Dancing Celebration' },
          { value: 'cake_celebration', label: '🎂 Birthday Cake & Balloons' },
          { value: 'couple_hands', label: '💑 Couple Joining Hands' },
          { value: 'baby_walk', label: '👶 Baby Walk' },
          { value: 'custom_sprite', label: '🖼️ Custom Sprite Sheet URL' },
        ],
      },
      { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Animation caption', translatable: true },
      { key: 'spriteSheetUrl', label: 'Custom Sprite Sheet URL (Optional)', type: 'url', placeholder: 'https://...', translatable: false },
    ],
  },
  {
    type: 'youtube_audio',
    category: 'media',
    name: 'YouTube Background Song',
    icon: '🎵',
    summary: 'Hidden-video YouTube audio player in continuous repeat mode.',
    defaultData: {
      youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      title: 'Our Romantic Soundtrack',
      autoPlay: true,
    },
    defaultTranslations: {
      ta: {
        title: 'எங்கள் காதல் பாடல்',
      },
    },
    fields: [
      { key: 'youtubeUrl', label: 'YouTube Song URL or ID', type: 'url', placeholder: 'https://youtu.be/...', translatable: false },
      { key: 'title', label: 'Song Label', type: 'text', placeholder: 'Our Romantic Soundtrack', translatable: true },
      { key: 'autoPlay', label: 'Start Playing Immediately', type: 'boolean', translatable: false },
    ],
  },
  {
    type: 'youtube_video',
    category: 'media',
    name: 'YouTube Video Showcase',
    icon: '🎬',
    summary: 'Clean 16:9 YouTube video card for teasers or memories.',
    defaultData: {
      youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      title: 'Our Story Film',
      loop: true,
    },
    defaultTranslations: {
      ta: {
        title: 'எங்கள் நினைவு வீடியோ',
      },
    },
    fields: [
      { key: 'youtubeUrl', label: 'YouTube Video URL or ID', type: 'url', placeholder: 'https://youtu.be/...', translatable: false },
      { key: 'title', label: 'Video Caption', type: 'text', placeholder: 'Our Story Film', translatable: true },
      { key: 'loop', label: 'Loop Video', type: 'boolean', translatable: false },
    ],
  },
];

const FLOATING_GLYPHS: Record<FloatingStyleType, string[]> = {
  hearts: ['💖', '💕', '💗', '💘'],
  sparkles: ['✨', '⭐', '💫', '🌟'],
  petals: ['🌸', '🌹', '🌺', '🌷'],
  confetti: ['🎉', '🎊', '✨', '🎈'],
  butterflies: ['🦋', '💜', '✨', '🌸'],
  baby: ['🍼', '👣', '⭐', '☁️'],
  lanterns: ['🏮', '✨', '💛', '🌟'],
  diyas: ['🪔', '✨', '🌺', '💛'],
  ocean: ['🐚', '🌴', '✨', '🌊'],
  leaves: ['🌿', '🍃', '🌸', '✨'],
  party: ['🪩', '🎉', '✨', '🎈'],
  festive: ['🌼', '🦚', '✨', '💛'],
};

const NO_PROMPTS = ['No 🙈', 'Are you sure? 🥺', 'Think again! 💭', 'Can’t catch me! 💨', 'Pretty please? 💖'];

const PRESET_OPTIONS: { id: StarterPresetType; label: string }[] = [
  { id: 'proposal', label: '💖 Love Proposal' },
  { id: 'invitation', label: '👑 Wedding Invite' },
  { id: 'birthday', label: '🎂 Birthday Bash' },
  { id: 'anniversary', label: '🥂 Anniversary Gala' },
  { id: 'baby_shower', label: '🍼 Baby Shower' },
];

function extractYouTubeId(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const match = raw.match(re);
    if (match && match[1]) return match[1];
  }
  return '';
}

function getPresetTemplateId(preset: StarterPresetType): string {
  switch (preset) {
    case 'invitation':
      return 'tpl_royal_maroon';
    case 'birthday':
      return 'tpl_neon_party';
    case 'anniversary':
      return 'tpl_champagne_noir';
    case 'baby_shower':
      return 'tpl_pastel_baby';
    default:
      return 'tpl_blush_hearts';
  }
}

function buildStarterBlocks(
  preset: StarterPresetType,
  registry: SmileyyfyWidgetDefinition[]
): SmileyyfyCanvasBlock[] {
  const types =
    preset === 'invitation'
      ? ['hero_header', 'couple_hands_anim', 'event_details', 'countdown_timer', 'youtube_audio', 'rsvp_card']
      : preset === 'birthday'
      ? ['hero_header', 'story_sprite_anim', 'event_details', 'countdown_timer', 'dress_code_card', 'rsvp_card']
      : preset === 'anniversary'
      ? ['hero_header', 'milestone_timeline', 'photo_polaroids', 'countdown_timer', 'youtube_audio', 'rsvp_card']
      : preset === 'baby_shower'
      ? ['text_banner', 'baby_walk_anim', 'event_details', 'countdown_timer', 'dress_code_card', 'rsvp_card']
      : ['love_letter', 'couple_hands_anim', 'photo_polaroids', 'flying_proposal', 'youtube_audio'];

  return types
    .map((t, idx) => {
      const def = registry.find((w) => w.type === t);
      if (!def) return null;
      const clonedTranslations: Record<string, Record<string, string>> = {};
      if (def.defaultTranslations) {
        Object.keys(def.defaultTranslations).forEach((lang) => {
          clonedTranslations[lang] = { ...def.defaultTranslations![lang] };
        });
      }
      const data: Record<string, string | boolean> = { ...def.defaultData };

      if (preset === 'birthday') {
        if (t === 'hero_header') {
          data.badge = 'BIRTHDAY BASH';
          data.names = 'Riya Turns 25! 🎂';
          data.subtitle = 'Music, cake, and midnight memories — come celebrate with us!';
          clonedTranslations.ta = {
            badge: 'பிறந்தநாள் கொண்டாட்டம்',
            names: 'ரியாவின் 25வது பிறந்தநாள்! 🎂',
            subtitle: 'இசை, கேக் மற்றும் இனிய நினைவுகளுடன் கொண்டாட அன்புடன் அழைக்கிறோம்!',
          };
        } else if (t === 'story_sprite_anim') {
          data.scene = 'cake_celebration';
          data.caption = 'Make a Wish & Let’s Party! 🎈';
        } else if (t === 'dress_code_card') {
          data.dressCode = 'Neon Chic & Party Glam';
          data.note = 'Doors open at 7:30 PM — rooftop DJ starts at 8:30 PM.';
        }
      } else if (preset === 'anniversary') {
        if (t === 'hero_header') {
          data.badge = 'SILVER ANNIVERSARY GALA';
          data.names = 'Karthik & Ananya';
          data.subtitle = 'Celebrating 10 wonderful years of love, laughter & family';
          clonedTranslations.ta = {
            badge: 'திருமண நாள் விழா',
            names: 'கார்த்திக் & அனன்யா',
            subtitle: '10 ஆண்டுகால அன்பையும் மகிழ்ச்சியையும் குடும்பத்தாருடன் கொண்டாடுகிறோம்',
          };
        }
      }

      return {
        id: `blk_${t}_${idx + 1}`,
        type: def.type,
        data,
        translations: clonedTranslations,
      };
    })
    .filter((b): b is SmileyyfyCanvasBlock => Boolean(b));
}

function isFieldTranslatable(field: SmileyyfyWidgetField): boolean {
  if (typeof field.translatable === 'boolean') return field.translatable;
  return field.type === 'text' || field.type === 'textarea';
}

function CountdownBlockView({ label, targetDate }: { label: string; targetDate: string }) {
  const [nowTs, setNowTs] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNowTs(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const parsed = Date.parse(targetDate);
  const diffMs = Number.isNaN(parsed) ? 0 : Math.max(0, parsed - nowTs);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diffMs / (1000 * 60)) % 60);
  const secs = Math.floor((diffMs / 1000) % 60);

  return (
    <div className={styles.countdownWrap}>
      <div className={styles.countdownTitle}>⏳ {label || 'Countdown'}</div>
      <div className={styles.countdownGrid}>
        <div className={styles.cdCell}>
          <strong>{days}</strong>
          <span>Days</span>
        </div>
        <div className={styles.cdCell}>
          <strong>{String(hours).padStart(2, '0')}</strong>
          <span>Hours</span>
        </div>
        <div className={styles.cdCell}>
          <strong>{String(mins).padStart(2, '0')}</strong>
          <span>Mins</span>
        </div>
        <div className={`${styles.cdCell} ${styles.cdSec}`}>
          <strong>{String(secs).padStart(2, '0')}</strong>
          <span>Secs</span>
        </div>
      </div>
    </div>
  );
}

function InlineStorySprite({
  scene = 'couple_hands',
  caption = '',
  leftEmoji = '🤵',
  rightEmoji = '👰',
  spriteSheetUrl = '',
}: {
  scene: StorySpriteScene;
  caption: string;
  leftEmoji?: string;
  rightEmoji?: string;
  spriteSheetUrl?: string;
}) {
  const [playing, setPlaying] = useState(true);
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (!playing || scene !== 'custom_sprite' || !spriteSheetUrl) return;
    const t = window.setInterval(() => setFrameIdx((f) => (f + 1) % 6), 140);
    return () => window.clearInterval(t);
  }, [playing, scene, spriteSheetUrl]);

  return (
    <div className={`${styles.spriteBox} ${!playing ? styles.spritePaused : ''}`}>
      <div className={styles.spriteStage} aria-hidden="true">
        {scene === 'couple_hands' && (
          <div className={styles.coupleScene}>
            <span className={styles.leftChar}>{leftEmoji || '🤵'}</span>
            <span className={styles.handsBridge}>🤝</span>
            <span className={styles.heartPop}>💖</span>
            <span className={styles.rightChar}>{rightEmoji || '👰'}</span>
          </div>
        )}
        {scene === 'baby_walk' && (
          <div className={styles.babyScene}>
            <div className={styles.footprintTrail}>👣 &nbsp; 👣 &nbsp; 👣</div>
            <div className={styles.babyWalker}>👶</div>
            <div className={styles.babyGoal}>🍼✨</div>
          </div>
        )}
        {scene === 'ring_sparkle' && (
          <div className={styles.ringScene}>
            <span className={styles.sparkleOrbit}>✨</span>
            <span className={styles.ringHero}>💍</span>
            <span className={styles.sparkleOrbitAlt}>💖</span>
          </div>
        )}
        {scene === 'dancing_hearts' && (
          <div className={styles.danceScene}>
            <span className={styles.musicFloat}>🎶</span>
            <span className={styles.dancerA}>💃</span>
            <span className={styles.dancerB}>🕺</span>
            <span className={styles.musicFloatAlt}>🎵</span>
          </div>
        )}
        {scene === 'cake_celebration' && (
          <div className={styles.cakeScene}>
            <span className={styles.balloonLeft}>🎈</span>
            <span className={styles.cakeHero}>🎂</span>
            <span className={styles.balloonRight}>🎉</span>
          </div>
        )}
        {scene === 'custom_sprite' &&
          (spriteSheetUrl ? (
            <div
              className={styles.customSpriteFrame}
              style={{
                backgroundImage: `url(${spriteSheetUrl})`,
                backgroundSize: '600% 100%',
                backgroundPosition: `${(frameIdx / 5) * 100}% 0%`,
              }}
            />
          ) : (
            <div className={styles.customStub}>🖼️ Add a horizontal sprite sheet URL</div>
          ))}
      </div>
      <div className={styles.spriteFooter}>
        <span className={styles.spriteCaption}>{caption}</span>
        <button type="button" className={styles.spriteToggleBtn} onClick={() => setPlaying((p) => !p)}>
          {playing ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>
    </div>
  );
}

function InlineYouTubePlayer({
  mediaMode,
  youtubeUrl,
  title,
  autoPlay = false,
  loop = true,
}: {
  mediaMode: 'audio' | 'video';
  youtubeUrl: string;
  title: string;
  autoPlay?: boolean;
  loop?: boolean;
}) {
  const [playing, setPlaying] = useState(Boolean(autoPlay));
  const [muted, setMuted] = useState(false);
  const videoId = useMemo(() => extractYouTubeId(youtubeUrl), [youtubeUrl]);

  const embedSrc = useMemo(() => {
    if (!videoId) return '';
    if (mediaMode === 'audio') {
      if (!playing) return '';
      const params = new URLSearchParams({
        autoplay: '1',
        loop: '1',
        playlist: videoId,
        controls: '0',
        modestbranding: '1',
        rel: '0',
        mute: muted ? '1' : '0',
      });
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    }
    const params = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      loop: loop ? '1' : '0',
      rel: '0',
      modestbranding: '1',
    });
    if (loop) params.set('playlist', videoId);
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId, mediaMode, playing, muted, autoPlay, loop]);

  if (!videoId) {
    return (
      <div className={styles.ytEmpty}>
        {mediaMode === 'audio' ? '🎵' : '🎬'} Paste a valid YouTube URL or 11-character video ID.
      </div>
    );
  }

  if (mediaMode === 'audio') {
    return (
      <div className={styles.ytAudioBar}>
        <div className={styles.ytAudioLeft}>
          <span className={`${styles.ytEqBadge} ${playing && !muted ? styles.ytEqActive : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <div>
            <div className={styles.ytTitle}>{title || 'Background Song'}</div>
            <div className={styles.ytMeta}>
              {playing ? (muted ? 'Muted • Repeat Loop' : 'Playing Song • Repeat Loop 🔁') : 'Paused • Audio-Only YouTube'}
            </div>
          </div>
        </div>
        <div className={styles.ytActions}>
          <button type="button" className={styles.primaryMiniBtn} onClick={() => setPlaying((p) => !p)}>
            {playing ? '⏸ Pause' : '▶ Play Song'}
          </button>
          {playing && (
            <button
              type="button"
              className={styles.ghostMiniBtn}
              aria-label={muted ? 'Unmute song' : 'Mute song'}
              onClick={() => setMuted((m) => !m)}
            >
              {muted ? '🔇' : '🔊'}
            </button>
          )}
        </div>
        {playing && embedSrc && (
          <iframe
            className={styles.ytHiddenFrame}
            src={embedSrc}
            title={`${title} audio player`}
            allow="autoplay; encrypted-media"
            aria-hidden="true"
            tabIndex={-1}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.ytVideoCard}>
      <div className={styles.ytVideoTop}>
        <span className={styles.ytTitle}>🎬 {title || 'Celebration Video'}</span>
        {loop && <span className={styles.ytLoopChip}>🔁 Repeat On</span>}
      </div>
      <div className={styles.ytVideoWrap}>
        <iframe
          className={styles.ytVideoFrame}
          src={embedSrc}
          title={title || 'YouTube Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function PageCanvasBuilder({
  themeMode = 'light',
  starterPreset = 'invitation',
  initialLanguages,
  customWidgets = [],
  customTemplates = [],
  onSavePage,
}: PageCanvasBuilderProps) {
  const widgetRegistry = useMemo(() => {
    const extras = Array.isArray(customWidgets) ? customWidgets : [];
    const seen = new Set(DEFAULT_WIDGET_REGISTRY.map((w) => w.type));
    return [...DEFAULT_WIDGET_REGISTRY, ...extras.filter((w) => w && w.type && !seen.has(w.type))];
  }, [customWidgets]);

  const templates = useMemo(() => {
    const extras = Array.isArray(customTemplates) ? customTemplates : [];
    const seen = new Set(DEFAULT_BASE_TEMPLATES.map((t) => t.id));
    return [...DEFAULT_BASE_TEMPLATES, ...extras.filter((t) => t && t.id && !seen.has(t.id))];
  }, [customTemplates]);

  const [languages, setLanguages] = useState<SmileyyfyLanguageOption[]>(() =>
    Array.isArray(initialLanguages) && initialLanguages.length > 0 ? initialLanguages : DEFAULT_LANGUAGES
  );
  const defaultLanguage = languages[0]?.code || 'en';
  const [activeLang, setActiveLang] = useState<string>(defaultLanguage);
  const [showAddLang, setShowAddLang] = useState<boolean>(false);
  const [newLangCode, setNewLangCode] = useState<string>('');
  const [newLangLabel, setNewLangLabel] = useState<string>('');

  const [activePreset, setActivePreset] = useState<StarterPresetType>(starterPreset);
  const [activeCategory, setActiveCategory] = useState<'base' | SmileyyfyWidgetCategory>('base');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() =>
    getPresetTemplateId(starterPreset)
  );
  const [blocks, setBlocks] = useState<SmileyyfyCanvasBlock[]>(() =>
    buildStarterBlocks(starterPreset, widgetRegistry)
  );
  const [selectedBlockId, setSelectedBlockId] = useState<string>(() => blocks[0]?.id || '');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [draggedWidgetType, setDraggedWidgetType] = useState<string>('');
  const [draggedBlockId, setDraggedBlockId] = useState<string>('');
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [saveToast, setSaveToast] = useState<string>('');

  const [acceptedMap, setAcceptedMap] = useState<Record<string, boolean>>({});
  const [dodgeMap, setDodgeMap] = useState<Record<string, { count: number; top: number; left: number }>>({});
  const [rsvpSentMap, setRsvpSentMap] = useState<Record<string, string>>({});

  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;
  const selectedDef = selectedBlock ? widgetRegistry.find((w) => w.type === selectedBlock.type) || null : null;
  const activeLangObj = languages.find((l) => l.code === activeLang) || languages[0];

  const getLocalizedString = (block: SmileyyfyCanvasBlock, key: string, fallback = ''): string => {
    if (activeLang !== defaultLanguage) {
      const translated = block.translations?.[activeLang]?.[key];
      if (typeof translated === 'string' && translated.trim() !== '') {
        return translated;
      }
    }
    const baseVal = block.data[key];
    return baseVal !== undefined && baseVal !== null ? String(baseVal) : fallback;
  };

  const addLanguage = (codeInput: string, labelInput: string) => {
    const cleanCode = codeInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 10);
    const cleanLabel = labelInput.trim() || cleanCode.toUpperCase();
    if (!cleanCode) return;
    if (!languages.some((l) => l.code === cleanCode)) {
      setLanguages((prev) => [...prev, { code: cleanCode, label: cleanLabel }]);
    }
    setActiveLang(cleanCode);
    setNewLangCode('');
    setNewLangLabel('');
    setShowAddLang(false);
  };

  const removeLanguage = (code: string) => {
    if (code === defaultLanguage || languages.length <= 1) return;
    setLanguages((prev) => prev.filter((l) => l.code !== code));
    if (activeLang === code) setActiveLang(defaultLanguage);
  };

  const addWidgetBlock = (widgetType: string, insertIndex?: number) => {
    const def = widgetRegistry.find((w) => w.type === widgetType);
    if (!def) return;
    const clonedTranslations: Record<string, Record<string, string>> = {};
    if (def.defaultTranslations) {
      Object.keys(def.defaultTranslations).forEach((lang) => {
        clonedTranslations[lang] = { ...def.defaultTranslations![lang] };
      });
    }
    const nextBlock: SmileyyfyCanvasBlock = {
      id: `blk_${def.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: def.type,
      data: { ...def.defaultData },
      translations: clonedTranslations,
    };
    setBlocks((prev) => {
      if (typeof insertIndex === 'number' && insertIndex >= 0 && insertIndex <= prev.length) {
        const copy = [...prev];
        copy.splice(insertIndex, 0, nextBlock);
        return copy;
      }
      return [...prev, nextBlock];
    });
    setSelectedBlockId(nextBlock.id);
  };

  const duplicateBlock = (id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0) return prev;
      const source = prev[idx];
      const clonedTranslations: Record<string, Record<string, string>> = {};
      if (source.translations) {
        Object.keys(source.translations).forEach((lang) => {
          clonedTranslations[lang] = { ...source.translations![lang] };
        });
      }
      const clone: SmileyyfyCanvasBlock = {
        id: `blk_${source.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type: source.type,
        data: { ...source.data },
        translations: clonedTranslations,
      };
      const copy = [...prev];
      copy.splice(idx + 1, 0, clone);
      setSelectedBlockId(clone.id);
      return copy;
    });
  };

  const moveBlock = (id: string, dir: -1 | 1) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(idx, 1);
      copy.splice(target, 0, item);
      return copy;
    });
  };

  const reorderBlock = (sourceId: string, targetIndex: number) => {
    setBlocks((prev) => {
      const fromIdx = prev.findIndex((b) => b.id === sourceId);
      if (fromIdx < 0 || fromIdx === targetIndex) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId('');
  };

  const updateBlockField = (
    blockId: string,
    field: SmileyyfyWidgetField,
    value: string | boolean
  ) => {
    const localized = activeLang !== defaultLanguage && isFieldTranslatable(field) && typeof value === 'string';
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        if (localized) {
          return {
            ...b,
            translations: {
              ...(b.translations || {}),
              [activeLang]: {
                ...(b.translations?.[activeLang] || {}),
                [field.key]: value,
              },
            },
          };
        }
        return { ...b, data: { ...b.data, [field.key]: value } };
      })
    );
  };

  const handleCanvasDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();
    const newType = e.dataTransfer.getData('text/smileyyfy-widget') || draggedWidgetType;
    const movingId = e.dataTransfer.getData('text/smileyyfy-block') || draggedBlockId;
    if (newType) {
      addWidgetBlock(newType, targetIndex);
    } else if (movingId && typeof targetIndex === 'number') {
      reorderBlock(movingId, targetIndex);
    }
    setDraggedWidgetType('');
    setDraggedBlockId('');
    setDropTargetIndex(null);
  };

  const handleSave = () => {
    onSavePage?.({
      templateId: activeTemplate.id,
      defaultLanguage,
      languages,
      blocks,
    });
    setSaveToast(`Page saved (${blocks.length} blocks • ${languages.length} language${languages.length > 1 ? 's' : ''})!`);
    window.setTimeout(() => setSaveToast(''), 2600);
  };

  const loadPreset = (preset: StarterPresetType) => {
    const next = buildStarterBlocks(preset, widgetRegistry);
    setActivePreset(preset);
    setBlocks(next);
    setSelectedTemplateId(getPresetTemplateId(preset));
    setSelectedBlockId(next[0]?.id || '');
  };

  const renderBlockContent = (block: SmileyyfyCanvasBlock) => {
    const d = block.data;

    if (block.type === 'text_banner') {
      return (
        <div className={styles.cardHero}>
          <div className={styles.ornament}>✦ ❀ ✦</div>
          <h2 className={styles.heroNames}>{getLocalizedString(block, 'heading', 'Celebration Title')}</h2>
          <p className={styles.heroSub}>{getLocalizedString(block, 'subtext', '')}</p>
        </div>
      );
    }

    if (block.type === 'story_paragraph') {
      return (
        <div className={styles.letterBox}>
          <div className={styles.letterGreeting}>{getLocalizedString(block, 'title', 'Our Story')}</div>
          <p className={styles.letterBody}>{getLocalizedString(block, 'body', '')}</p>
        </div>
      );
    }

    if (block.type === 'rich_quote') {
      return (
        <blockquote className={styles.quoteCard}>
          <p className={styles.quoteText}>{getLocalizedString(block, 'quote', '')}</p>
          <footer className={styles.quoteAuthor}>— {getLocalizedString(block, 'author', '')}</footer>
        </blockquote>
      );
    }

    if (block.type === 'milestone_timeline') {
      const steps = [
        { title: getLocalizedString(block, 'step1Title'), note: getLocalizedString(block, 'step1Note') },
        { title: getLocalizedString(block, 'step2Title'), note: getLocalizedString(block, 'step2Note') },
        { title: getLocalizedString(block, 'step3Title'), note: getLocalizedString(block, 'step3Note') },
      ].filter((s) => s.title || s.note);
      return (
        <div className={styles.timelineWrap}>
          {steps.map((step, i) => (
            <div key={i} className={styles.timelineRow}>
              <span className={styles.timelineDot}>{i + 1}</span>
              <div>
                <div className={styles.timelineTitle}>{step.title}</div>
                <div className={styles.timelineNote}>{step.note}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (block.type === 'hero_header') {
      return (
        <div className={styles.cardHero}>
          <span className={styles.heroBadge}>{getLocalizedString(block, 'badge', 'INVITATION')}</span>
          <h2 className={styles.heroNames}>{getLocalizedString(block, 'names', 'Your Names')}</h2>
          <p className={styles.heroSub}>{getLocalizedString(block, 'subtitle', '')}</p>
        </div>
      );
    }

    if (block.type === 'event_details') {
      return (
        <div className={styles.detailCard}>
          <div className={styles.detailCell}>
            <span className={styles.detailLbl}>DATE</span>
            <strong>📅 {String(d.date || 'TBD')}</strong>
          </div>
          <div className={styles.detailCell}>
            <span className={styles.detailLbl}>TIME</span>
            <strong>⏰ {getLocalizedString(block, 'time', 'TBD')}</strong>
          </div>
          <div className={styles.detailCellWide}>
            <span className={styles.detailLbl}>VENUE</span>
            <strong>📍 {getLocalizedString(block, 'venue', 'Location TBD')}</strong>
          </div>
        </div>
      );
    }

    if (block.type === 'countdown_timer') {
      return (
        <CountdownBlockView
          label={getLocalizedString(block, 'label', 'Countdown')}
          targetDate={String(d.targetDate || '')}
        />
      );
    }

    if (block.type === 'dress_code_card') {
      return (
        <div className={styles.dressBox}>
          <span className={styles.heroBadge}>👗 DRESS CODE</span>
          <div className={styles.dressTheme}>{getLocalizedString(block, 'dressCode', 'Festive Attire')}</div>
          <p className={styles.heroSub}>{getLocalizedString(block, 'note', '')}</p>
        </div>
      );
    }

    if (block.type === 'rsvp_card') {
      const sent = rsvpSentMap[block.id];
      return (
        <div className={styles.rsvpBox}>
          <h3 className={styles.blockHeading}>📋 {getLocalizedString(block, 'heading', 'Will You Join Us?')}</h3>
          {sent ? (
            <div className={styles.rsvpDone}>✅ Thanks, {sent}! Your RSVP is recorded.</div>
          ) : (
            <form
              className={styles.rsvpInlineForm}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const guest = String(formData.get('guestName') || 'Guest').trim();
                setRsvpSentMap((prev) => ({ ...prev, [block.id]: guest || 'Guest' }));
              }}
            >
              <input name="guestName" type="text" required placeholder="Your name" />
              {Boolean(d.allowPlusOne) && <input name="party" type="number" min={1} max={6} defaultValue={1} />}
              <button type="submit" className={styles.primaryMiniBtn}>
                {getLocalizedString(block, 'buttonLabel', 'Confirm RSVP')}
              </button>
            </form>
          )}
        </div>
      );
    }

    if (block.type === 'love_letter') {
      return (
        <div className={styles.letterBox}>
          <div className={styles.letterGreeting}>{getLocalizedString(block, 'greeting', 'Dear You,')}</div>
          <p className={styles.letterBody}>{getLocalizedString(block, 'body', '')}</p>
          <div className={styles.letterSig}>— {getLocalizedString(block, 'signature', 'Forever Yours')}</div>
        </div>
      );
    }

    if (block.type === 'photo_polaroids') {
      const items = [
        { url: String(d.photoOneUrl || ''), cap: getLocalizedString(block, 'captionOne', 'Memory 1'), icon: '💑', rot: -2.5 },
        { url: String(d.photoTwoUrl || ''), cap: getLocalizedString(block, 'captionTwo', 'Memory 2'), icon: '💍', rot: 2.5 },
      ];
      return (
        <div className={styles.polaroidStrip}>
          {items.map((p, i) => (
            <figure key={i} className={styles.polaroid} style={{ transform: `rotate(${p.rot}deg)` }}>
              {p.url ? (
                <img src={p.url} alt={p.cap} className={styles.polaroidImg} />
              ) : (
                <div className={styles.polaroidStub}>{p.icon}</div>
              )}
              <figcaption className={styles.polaroidCap}>{p.cap}</figcaption>
            </figure>
          ))}
        </div>
      );
    }

    if (block.type === 'flying_proposal') {
      const isAccepted = Boolean(acceptedMap[block.id]);
      const dodge = dodgeMap[block.id] || { count: 0, top: 50, left: 68 };
      const flyNo = () => {
        setDodgeMap((prev) => ({
          ...prev,
          [block.id]: {
            count: (prev[block.id]?.count || 0) + 1,
            top: 18 + Math.floor(Math.random() * 64),
            left: 14 + Math.floor(Math.random() * 70),
          },
        }));
      };
      return (
        <div className={styles.proposalBox}>
          <h3 className={styles.proposalQ}>
            {isAccepted
              ? getLocalizedString(block, 'acceptedText', 'YAY!! 💍💖')
              : getLocalizedString(block, 'question', 'Will You Marry Me?')}
          </h3>
          {isAccepted ? (
            <button
              type="button"
              className={styles.ghostMiniBtn}
              onClick={() => setAcceptedMap((prev) => ({ ...prev, [block.id]: false }))}
            >
              ↺ Replay
            </button>
          ) : (
            <div className={styles.flyingArena}>
              <button
                type="button"
                className={styles.yesMiniBtn}
                style={{ transform: `scale(${Math.min(1.35, 1 + dodge.count * 0.07)})` }}
                onClick={() => setAcceptedMap((prev) => ({ ...prev, [block.id]: true }))}
              >
                {getLocalizedString(block, 'yesLabel', 'Yes! 💖')}
              </button>
              <button
                type="button"
                className={styles.noMiniBtn}
                style={
                  dodge.count > 0
                    ? { position: 'absolute', top: `${dodge.top}%`, left: `${dodge.left}%`, transform: 'translate(-50%, -50%)' }
                    : undefined
                }
                onMouseEnter={flyNo}
                onPointerDown={(e) => {
                  e.preventDefault();
                  flyNo();
                }}
                onClick={flyNo}
              >
                {dodge.count === 0
                  ? getLocalizedString(block, 'noLabel', 'No 🙈')
                  : NO_PROMPTS[dodge.count % NO_PROMPTS.length]}
              </button>
            </div>
          )}
        </div>
      );
    }

    if (block.type === 'couple_hands_anim' || block.type === 'baby_walk_anim' || block.type === 'story_sprite_anim') {
      const sceneVal = String(d.scene || 'couple_hands') as StorySpriteScene;
      return (
        <InlineStorySprite
          scene={sceneVal}
          caption={getLocalizedString(block, 'caption', '')}
          leftEmoji={String(d.leftEmoji || '🤵')}
          rightEmoji={String(d.rightEmoji || '👰')}
          spriteSheetUrl={String(d.spriteSheetUrl || '')}
        />
      );
    }

    if (block.type === 'youtube_audio') {
      return (
        <InlineYouTubePlayer
          mediaMode="audio"
          youtubeUrl={String(d.youtubeUrl || '')}
          title={getLocalizedString(block, 'title', 'Background Song')}
          autoPlay={Boolean(d.autoPlay)}
          loop
        />
      );
    }

    if (block.type === 'youtube_video') {
      return (
        <InlineYouTubePlayer
          mediaMode="video"
          youtubeUrl={String(d.youtubeUrl || '')}
          title={getLocalizedString(block, 'title', 'Our Story Video')}
          autoPlay={false}
          loop={Boolean(d.loop)}
        />
      );
    }

    const def = widgetRegistry.find((w) => w.type === block.type);
    return (
      <div className={styles.customFallback}>
        <strong>
          {def?.icon || '🧩'} {def?.name || block.type}
        </strong>
        <p>
          {Object.keys(d)
            .map((k) => getLocalizedString(block, k))
            .filter(Boolean)
            .join(' • ')}
        </p>
      </div>
    );
  };

  const glyphs = FLOATING_GLYPHS[activeTemplate.floatingStyle] || FLOATING_GLYPHS.hearts;

  return (
    <div className={`${styles.studio} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div className={styles.topBar}>
        <div className={styles.topLeft}>
          <span className={styles.studioTitle}>🎨 Smileyyfy Page Canvas Builder</span>
          <div className={styles.presetBtns}>
            {PRESET_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`${styles.miniPill} ${activePreset === p.id ? styles.activeMiniPill : ''}`}
                onClick={() => loadPreset(p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.topRight}>
          <div className={styles.viewportGroup} role="group" aria-label="Canvas viewport width">
            <button
              type="button"
              className={`${styles.vpBtn} ${viewportMode === 'desktop' ? styles.activeVpBtn : ''}`}
              onClick={() => setViewportMode('desktop')}
            >
              🖥️ Desktop
            </button>
            <button
              type="button"
              className={`${styles.vpBtn} ${viewportMode === 'mobile' ? styles.activeVpBtn : ''}`}
              onClick={() => setViewportMode('mobile')}
            >
              📱 Mobile
            </button>
          </div>
          <button
            type="button"
            className={`${styles.miniPill} ${previewMode ? styles.activeMiniPill : ''}`}
            onClick={() => setPreviewMode((p) => !p)}
          >
            {previewMode ? '✏️ Back to Editor' : '👁️ Live Preview'}
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            ✨ Save Page
          </button>
        </div>
      </div>

      <div className={styles.langBar} aria-label="Page languages">
        <div className={styles.langList}>
          <span className={styles.langTitle}>🌐 Languages:</span>
          {languages.map((lang) => (
            <div
              key={lang.code}
              className={`${styles.langChip} ${activeLang === lang.code ? styles.activeLangChip : ''}`}
            >
              <button
                type="button"
                className={styles.langSelectBtn}
                onClick={() => setActiveLang(lang.code)}
              >
                {lang.label} <small>({lang.code})</small>
              </button>
              {!previewMode && lang.code !== defaultLanguage && (
                <button
                  type="button"
                  className={styles.langRemoveBtn}
                  aria-label={`Remove ${lang.label}`}
                  onClick={() => removeLanguage(lang.code)}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          {!previewMode && (
            <button
              type="button"
              className={styles.addLangBtn}
              onClick={() => setShowAddLang((s) => !s)}
            >
              {showAddLang ? 'Close' : '+ Add Language'}
            </button>
          )}
        </div>

        {!previewMode && showAddLang && (
          <div className={styles.addLangPanel}>
            <div className={styles.quickLangRow}>
              {SUGGESTED_LANGUAGES.filter((s) => !languages.some((l) => l.code === s.code)).map((s) => (
                <button
                  key={s.code}
                  type="button"
                  className={styles.quickLangChip}
                  onClick={() => addLanguage(s.code, s.label)}
                >
                  + {s.label} ({s.code})
                </button>
              ))}
            </div>
            <form
              className={styles.customLangForm}
              onSubmit={(e) => {
                e.preventDefault();
                addLanguage(newLangCode, newLangLabel);
              }}
            >
              <input
                type="text"
                placeholder="Code (e.g. de, ja)"
                value={newLangCode}
                onChange={(e) => setNewLangCode(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Language Name (e.g. Deutsch)"
                value={newLangLabel}
                onChange={(e) => setNewLangLabel(e.target.value)}
                required
              />
              <button type="submit" className={styles.primaryMiniBtn}>
                Add
              </button>
            </form>
          </div>
        )}
      </div>

      {saveToast && (
        <div className={styles.toast} role="status">
          {saveToast}
        </div>
      )}

      <div className={`${styles.workspace} ${previewMode ? styles.previewOnlyGrid : ''}`}>
        {!previewMode && (
          <aside className={styles.palette} aria-label="Widget categories and palette">
            <div className={styles.catTabs}>
              {(
                [
                  { id: 'base', label: `🎨 Base (${templates.length})` },
                  { id: 'text', label: '✍️ Text' },
                  { id: 'invitation', label: '💌 Invite' },
                  { id: 'proposal', label: '💖 Proposal' },
                  { id: 'animate', label: '🎭 Animate' },
                  { id: 'media', label: '🎵 Media' },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.catBtn} ${activeCategory === cat.id ? styles.activeCat : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {activeCategory === 'base' ? (
              <div className={styles.paletteList}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    className={`${styles.tplCard} ${selectedTemplateId === tpl.id ? styles.activeTpl : ''}`}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                  >
                    <div className={styles.tplTop}>
                      <strong>{tpl.name}</strong>
                      <span>{tpl.badge}</span>
                    </div>
                    <p>{tpl.description}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.paletteList}>
                {widgetRegistry
                  .filter((w) => w.category === activeCategory)
                  .map((widget) => (
                    <div
                      key={widget.type}
                      draggable
                      onDragStart={(e) => {
                        setDraggedWidgetType(widget.type);
                        e.dataTransfer.setData('text/smileyyfy-widget', widget.type);
                      }}
                      onDragEnd={() => {
                        setDraggedWidgetType('');
                        setDropTargetIndex(null);
                      }}
                      className={styles.widgetTile}
                    >
                      <div className={styles.widgetTileTop}>
                        <span>
                          {widget.icon} <strong>{widget.name}</strong>
                        </span>
                        <button
                          type="button"
                          className={styles.addBtn}
                          onClick={() => addWidgetBlock(widget.type)}
                        >
                          + Add
                        </button>
                      </div>
                      <p className={styles.widgetSummary}>{widget.summary}</p>
                    </div>
                  ))}
              </div>
            )}
          </aside>
        )}

        <main
          className={`${styles.canvas} ${styles[`surf_${activeTemplate.surfaceKey}`] || styles.surf_blush} ${
            viewportMode === 'mobile' ? styles.canvasMobile : ''
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleCanvasDrop(e)}
        >
          <div className={styles.floatingLayer} aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <span
                key={`${activeTemplate.id}-${i}`}
                className={styles.floater}
                style={{
                  left: `${(i * 31 + 7) % 92}%`,
                  animationDelay: `${(i % 6) * 0.6}s`,
                  animationDuration: `${4.2 + (i % 4)}s`,
                }}
              >
                {glyphs[i % glyphs.length]}
              </span>
            ))}
          </div>

          <div className={styles.canvasStack}>
            {blocks.length === 0 ? (
              <div className={styles.dropHint}>
                Drag a widget from the left palette or click <strong>+ Add</strong> to start building your page.
              </div>
            ) : (
              blocks.map((block, index) => {
                const isSelected = !previewMode && selectedBlockId === block.id;
                const isDropHere = !previewMode && dropTargetIndex === index;
                const def = widgetRegistry.find((w) => w.type === block.type);
                return (
                  <div
                    key={block.id}
                    draggable={!previewMode}
                    onDragStart={(e) => {
                      setDraggedBlockId(block.id);
                      e.dataTransfer.setData('text/smileyyfy-block', block.id);
                    }}
                    onDragEnd={() => {
                      setDraggedBlockId('');
                      setDropTargetIndex(null);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDropTargetIndex(index);
                    }}
                    onDrop={(e) => {
                      e.stopPropagation();
                      handleCanvasDrop(e, index);
                    }}
                    onClick={() => {
                      if (!previewMode) setSelectedBlockId(block.id);
                    }}
                    className={`${styles.blockShell} ${isSelected ? styles.selectedBlock : ''} ${
                      isDropHere ? styles.dropActive : ''
                    }`}
                  >
                    {!previewMode && (
                      <div className={styles.blockChrome}>
                        <span className={styles.dragHandle}>
                          ⋮⋮ {def?.icon} {def?.name || block.type}
                        </span>
                        <div className={styles.blockBtns}>
                          <button
                            type="button"
                            aria-label="Move up"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, -1);
                            }}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            aria-label="Move down"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveBlock(block.id, 1);
                            }}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            aria-label="Duplicate widget"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateBlock(block.id);
                            }}
                          >
                            ⧉
                          </button>
                          <button
                            type="button"
                            aria-label="Remove widget"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBlock(block.id);
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                    {renderBlockContent(block)}
                  </div>
                );
              })
            )}
          </div>
        </main>

        {!previewMode && (
          <aside className={styles.inspector} aria-label="Focused widget editor">
            <div className={styles.inspHeader}>
              <h3 className={styles.inspTitle}>⚙️ Quick Edit</h3>
              <span className={styles.langPillMini}>
                🌐 {activeLangObj?.label || activeLang}
              </span>
            </div>

            {selectedBlock && selectedDef ? (
              <div className={styles.inspFields}>
                <div className={styles.inspBadge}>
                  {selectedDef.icon} {selectedDef.name}
                </div>
                {activeLang !== defaultLanguage && (
                  <div className={styles.langHint}>
                    Editing <strong>{activeLangObj?.label}</strong> text. Blank fields fall back to {languages[0]?.label}.
                  </div>
                )}
                {selectedDef.fields.map((field) => {
                  const translatable = isFieldTranslatable(field);
                  const isLocalizedEdit = activeLang !== defaultLanguage && translatable;
                  const val = isLocalizedEdit
                    ? selectedBlock.translations?.[activeLang]?.[field.key] ?? ''
                    : selectedBlock.data[field.key];
                  const fallbackPlaceholder = isLocalizedEdit
                    ? String(selectedBlock.data[field.key] || field.placeholder || '')
                    : field.placeholder;

                  if (field.type === 'boolean') {
                    return (
                      <label key={field.key} className={styles.checkField}>
                        <input
                          type="checkbox"
                          checked={Boolean(val)}
                          onChange={(e) => updateBlockField(selectedBlock.id, field, e.target.checked)}
                        />
                        <span>{field.label}</span>
                      </label>
                    );
                  }
                  if (field.type === 'select' && Array.isArray(field.options)) {
                    return (
                      <label key={field.key} className={styles.textField}>
                        <span>{field.label}</span>
                        <select
                          value={String(val || '')}
                          onChange={(e) => updateBlockField(selectedBlock.id, field, e.target.value)}
                        >
                          {field.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }
                  if (field.type === 'textarea') {
                    return (
                      <label key={field.key} className={styles.textField}>
                        <span>
                          {field.label} {isLocalizedEdit && <em>({activeLang})</em>}
                        </span>
                        <textarea
                          rows={3}
                          value={String(val || '')}
                          placeholder={fallbackPlaceholder}
                          onChange={(e) => updateBlockField(selectedBlock.id, field, e.target.value)}
                        />
                      </label>
                    );
                  }
                  return (
                    <label key={field.key} className={styles.textField}>
                      <span>
                        {field.label} {isLocalizedEdit && <em>({activeLang})</em>}
                      </span>
                      <input
                        type={field.type === 'date' ? 'date' : field.type === 'url' ? 'url' : 'text'}
                        value={String(val || '')}
                        placeholder={fallbackPlaceholder}
                        onChange={(e) => updateBlockField(selectedBlock.id, field, e.target.value)}
                      />
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className={styles.inspEmpty}>Click any widget on the canvas to edit its text, language content, link, or animation.</p>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

export default PageCanvasBuilder;
