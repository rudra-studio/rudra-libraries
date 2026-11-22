import type SmileyyfyWidgetDefinition from './SmileyyfyWidgetDefinition';

const defaultWidgetRegistry: SmileyyfyWidgetDefinition[] = [
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

export default defaultWidgetRegistry;
