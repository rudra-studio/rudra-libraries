import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.scss';

export interface ProposalExperienceProps {
  /** @translate */
  partnerName?: string;
  /** @translate */
  senderName?: string;
  /** @select|ml|en */
  defaultLanguage?: 'ml' | 'en';
  /** @optional */
  youtubeVideoId?: string;
  /** @type|function */
  onAccept?: () => void;
}

interface FloatingHeart {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  sway: number;
}

interface BurstParticle {
  id: number;
  angle: number;
  distance: number;
  size: number;
  duration: number;
  hue: string;
}

interface NoStage {
  buttonLabel: string;
  headline: string;
  banner: string;
  heartMood: 'normal' | 'shocked' | 'cracked' | 'dizzy' | 'pleading' | 'love';
  cartoonMood: 'shy' | 'shocked' | 'crying' | 'running' | 'puppy' | 'celebrate';
}

interface ChapterItem {
  tag: string;
  title: string;
  text: string;
}

interface CopyDeck {
  toggleLabel: string;
  musicOnLabel: string;
  musicOffLabel: string;
  sealedKicker: string;
  sealedHeading: string;
  sealedLead: string;
  sealedCta: string;
  storyKicker: string;
  storyHeading: string;
  chapters: ChapterItem[];
  romanticPromise: string;
  storyCta: string;
  questionKicker: string;
  questionLead: string;
  yesButton: string;
  noStages: NoStage[];
  acceptedKicker: string;
  acceptedHeadline: string;
  acceptedLead: string;
  teaseRecap: (count: number) => string;
  keepsakeLabel: string;
  replayLink: string;
}

const DEFAULT_UN_VIZHIGALIL_VIDEO_ID = 'L3G_W4g17gA';

const CONTENT: Record<'ml' | 'en', CopyDeck> = {
  ml: {
    toggleLabel: 'English',
    musicOnLabel: 'സംഗീതം ഓൺ',
    musicOffLabel: 'സംഗീതം ഓഫ്',
    sealedKicker: 'നിനക്കായി എന്റെ ഹൃദയത്തിൽ നിന്നൊരു കത്ത്',
    sealedHeading: 'എന്റെ ഹൃദയത്തിന്റെ ഓരോ മിടിപ്പും എന്നെ നിന്നിലേക്കാണ് എത്തിച്ചത്.',
    sealedLead:
      'നമ്മുടെ ജീവിതത്തിലെ ഏറ്റവും മനോഹരമായ അടുത്ത ചുവടുവെപ്പിന് മുൻപ്, നിന്നോട് പറയാൻ എന്റെ മനസ്സ് കാത്തുവെച്ച ചില വാക്കുകൾ ഇവിടെ കുറിക്കുന്നു...',
    sealedCta: 'എന്റെ ഹൃദയം തുറക്കൂ',
    storyKicker: 'നിനക്കായി മാത്രം',
    storyHeading: 'എന്തുകൊണ്ട് എപ്പോഴും നീ മാത്രമായി...',
    chapters: [
      {
        tag: 'അധ്യായം ഒന്ന്',
        title: 'ആദ്യ കാഴ്ചയിലെ പ്രണയം',
        text: 'നിന്നെ ആദ്യമായി കണ്ട നിമിഷം തന്നെ എന്റെ മനസ്സ് നിന്നിൽ ഉടക്കി... ഒരുപക്ഷേ നിന്റെ ആ അഴകും നിഷ്കളങ്കമായ ചിരിയും കൊണ്ടാവാം, ആദ്യ കാഴ്ചയിൽ തന്നെ എനിക്ക് നിന്നോട് പ്രണയം തോന്നി.',
      },
      {
        tag: 'അധ്യായം രണ്ട്',
        title: 'നീ എന്നിലർപ്പിച്ച വിശ്വാസം',
        text: 'എന്നോട് മനസ്സ് തുറന്ന് സംസാരിക്കുന്ന നിന്റെ രീതിയും, നീ എന്നിൽ അർപ്പിക്കുന്ന ആ ആഴത്തിലുള്ള വിശ്വാസവുമാണ് എനിക്ക് ഏറ്റവും പ്രിയപ്പെട്ടത്. നിന്റെ ആ സ്നേഹം എന്നെ എന്നും അത്ഭുതപ്പെടുത്തുന്നു.',
      },
      {
        tag: 'അധ്യായം മൂന്ന്',
        title: 'ജീവിതകാലം മുഴുവൻ ഒരുമിച്ചുള്ള യാത്ര',
        text: 'ഇനിയുള്ള എന്റെ ജീവിതകാലം മുഴുവൻ നിന്റെ കൈപിടിച്ച്, പുതിയ വഴികളിലൂടെയും സ്വപ്നങ്ങളിലൂടെയും നിന്നോടൊപ്പം യാത്ര ചെയ്യാൻ ഞാൻ ആഗ്രഹിക്കുന്നു.',
      },
      {
        tag: 'അധ്യായം നാല്',
        title: 'നിനക്കായി ഞാൻ മാറിക്കൊണ്ടിരിക്കുന്നു',
        text: 'നിനക്ക് ഏറ്റവും ചേർന്ന ഒരാളാകാൻ ഞാൻ എന്നും പരിശ്രമിച്ചുകൊണ്ടിരിക്കുകയാണ്. നിനക്ക് പറ്റിയ ഏറ്റവും പെർഫെക്റ്റ് ആയ ആളല്ല ഞാനെന്ന് എനിക്കറിയാം, പക്ഷേ നിനക്കായി എന്റെ ഏറ്റവും മികച്ചത് നൽകാൻ ഞാൻ എന്നും ശ്രമിക്കും.',
      },
    ],
    romanticPromise:
      '“ആയിരം ജന്മങ്ങൾ ഉണ്ടെങ്കിൽ, ഓരോ ജന്മത്തിലും ഞാൻ നിന്നെത്തന്നെ തിരഞ്ഞെടുക്കും. എന്റെ സന്തോഷവും സമാധാനവും വീടും എല്ലാം നീയാണ്.”',
    storyCta: 'ഒരു ചോദ്യം ബാക്കിയുണ്ട്...',
    questionKicker: 'എന്റെ പ്രിയപ്പെട്ടവളേ, എന്റെ ആത്മസഖിയേ',
    questionLead:
      'ഈ ജീവിതത്തിലും ഇനിയുള്ള എല്ലാ കാലത്തും, എന്റെ കൈപിടിച്ച് എന്റെ കൂടെ നടക്കാമോ? എന്നെ വിവാഹം കഴിക്കാമോ?',
    yesButton: 'സമ്മതം, ഒരായിരം വട്ടം! ♥',
    noStages: [
      {
        buttonLabel: 'ഇപ്പോൾ വേണ്ട',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ?',
        banner: '',
        heartMood: 'normal',
        cartoonMood: 'shy',
      },
      {
        buttonLabel: 'സത്യമായിട്ടും?!',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ?',
        banner: '🚨 Error 404: നമ്മുടെ പ്രണയകഥയിൽ "No" എന്നൊരു വാക്കേ ഇല്ല! ഒന്നുകൂടി ആലോചിക്കൂ 😄',
        heartMood: 'shocked',
        cartoonMood: 'shocked',
      },
      {
        buttonLabel: 'വീണ്ടും No ആണോ?!',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ? 🥺',
        banner: '💔 അയ്യോ! എന്റെ ഹൃദയം ചെറുതായിട്ടൊന്ന് പൊട്ടി... "സമ്മതം" ഞെക്കിയാൽ ഇപ്പോൾ ശരിയാകും!',
        heartMood: 'cracked',
        cartoonMood: 'crying',
      },
      {
        buttonLabel: 'പിടിക്കാൻ പറ്റുമോ നോക്കൂ',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ? 🏃‍♂️💨',
        banner: '🙈 കൊള്ളാം! പേടിച്ചിട്ട് "No" ബട്ടൺ ഓടി ഒളിക്കാൻ തുടങ്ങി!',
        heartMood: 'dizzy',
        cartoonMood: 'running',
      },
      {
        buttonLabel: 'വളരെ ചെറുതായിപ്പോയി',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ? 🔍',
        banner: '🔬 നീ അറിയാതെ തെറ്റായ ബട്ടൺ ഞെക്കാതിരിക്കാൻ ഞാൻ ഇതിനെ ചെറുതാക്കിയതാ!',
        heartMood: 'pleading',
        cartoonMood: 'puppy',
      },
      {
        buttonLabel: 'ശരി സമ്മതം ♥',
        headline: 'എന്നെ വിവാഹം കഴിക്കാമോ? ✨',
        banner: '🪄 ട്വിസ്റ്റ്! "No" ബട്ടൺ പോലും നമ്മുടെ ഫാൻ ആയി മാറി—ഇനി രണ്ടും Yes ആണ്!',
        heartMood: 'love',
        cartoonMood: 'celebrate',
      },
    ],
    acceptedKicker: 'നമ്മുടെ എന്നേക്കുമായുള്ള യാത്ര ഇന്ന് തുടങ്ങുന്നു',
    acceptedHeadline: 'അവൾ സമ്മതം പറഞ്ഞു! ♥',
    acceptedLead:
      'ഒരായിരം ചിരികളും യാത്രകളും സ്നേഹവും നിറഞ്ഞ നമ്മുടെ മനോഹരമായ ജീവിതത്തിലേക്ക് സ്വാഗതം.',
    teaseRecap: (count: number) =>
      `(${count} തവണ "No" ഞെക്കാൻ നോക്കിയിട്ടും ഒടുവിൽ പ്രണയം തന്നെ ജയിച്ചു! 😉)`,
    keepsakeLabel: 'നമ്മുടെ പ്രണയത്തിന്റെ ഓർമ്മയ്ക്കായി',
    replayLink: 'ആദ്യം മുതൽ ഒരിക്കൽ കൂടി കാണാം',
  },
  en: {
    toggleLabel: 'മലയാളം',
    musicOnLabel: 'Music On',
    musicOffLabel: 'Music Off',
    sealedKicker: 'A Private Letter From My Heart To Yours',
    sealedHeading: 'Every beat of my heart led me straight to you.',
    sealedLead:
      'Before we take the most meaningful step of our lives, I wanted to put into words everything my heart has been holding for you...',
    sealedCta: 'Open My Heart',
    storyKicker: 'Written Only For You',
    storyHeading: 'Why It Has Always Been You',
    chapters: [
      {
        tag: 'Chapter I',
        title: 'Love at First Sight',
        text: 'The very first moment I saw you, something inside me knew—maybe it was your breathtaking beauty and effortless grace, because it truly was love at first sight.',
      },
      {
        tag: 'Chapter II',
        title: 'The Way You Trust Me',
        text: 'I fell even deeper for the way you open up to me and the quiet, unwavering trust you place in me. Being your safe space is the greatest privilege of my life.',
      },
      {
        tag: 'Chapter III',
        title: 'A Lifetime of Journeys Together',
        text: 'More than anything, I want to travel through the rest of this life hand in hand with you—exploring new places, chasing dreams, and making every road ours.',
      },
      {
        tag: 'Chapter IV',
        title: 'Becoming My Best For You',
        text: 'Every single day, I am working to become a better match for you. I know I am not the most perfect person for you, but I promise I will always try my very best.',
      },
    ],
    romanticPromise:
      '“In every lifetime, in every world, I would still walk across a crowded room and choose you all over again. You are my home.”',
    storyCta: 'One Question Left...',
    questionKicker: 'My Best Friend, My Love, My Soulmate',
    questionLead:
      'Through every season, every adventure, and every quiet morning—will you walk beside me forever and marry me?',
    yesButton: 'Yes, A Million Times! ♥',
    noStages: [
      {
        buttonLabel: 'Not yet',
        headline: 'Will You Marry Me?',
        banner: '',
        heartMood: 'normal',
        cartoonMood: 'shy',
      },
      {
        buttonLabel: 'Wait... really?',
        headline: 'Will You Marry Me?',
        banner: '🚨 Error 404: "No" was not found in our love story. Try again!',
        heartMood: 'shocked',
        cartoonMood: 'shocked',
      },
      {
        buttonLabel: 'Still no?!',
        headline: 'Will You Marry Me? 🥺',
        banner: '💔 Ouch! My heart just cracked a tiny bit... good thing you can fix it with Yes!',
        heartMood: 'cracked',
        cartoonMood: 'crying',
      },
      {
        buttonLabel: 'Catch me if you can',
        headline: 'Will You Marry Me? 🏃‍♂️💨',
        banner: '🙈 Nice try! The "No" button has officially gone into witness protection.',
        heartMood: 'dizzy',
        cartoonMood: 'running',
      },
      {
        buttonLabel: 'Too tiny to click',
        headline: 'Will You Marry Me? 🔍',
        banner: '🔬 I shrunk the "No" button so you wouldn’t accidentally tap the wrong one!',
        heartMood: 'pleading',
        cartoonMood: 'puppy',
      },
      {
        buttonLabel: 'Okay fine, Yes ♥',
        headline: 'Will You Marry Me? ✨',
        banner: '🪄 Plot twist: the "No" button switched sides because it ships us too!',
        heartMood: 'love',
        cartoonMood: 'celebrate',
      },
    ],
    acceptedKicker: 'Forever Begins Today',
    acceptedHeadline: 'She Said Yes! ♥',
    acceptedLead:
      'Here is to a lifetime of adventures, late-night talks, endless laughter, and growing old hand in hand.',
    teaseRecap: (count: number) =>
      `(Even after trying to hit "No" ${count} ${count === 1 ? 'time' : 'times'} — destiny still won! 😉)`,
    keepsakeLabel: 'Official Engagement Keepsake',
    replayLink: 'Relive the moment from the beginning',
  },
};

const ElegantHeartSvg: React.FC<{
  className?: string;
  gradientId: string;
  mood?: string;
}> = ({ className, gradientId, mood = 'normal' }) => (
  <svg
    viewBox="0 0 200 185"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={`${gradientId}-fill`} x1="20" y1="15" x2="180" y2="170" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f8c8d4" />
        <stop offset="45%" stopColor="#d96b8a" />
        <stop offset="100%" stopColor="#8c1d40" />
      </linearGradient>
      <linearGradient id={`${gradientId}-rim`} x1="0" y1="0" x2="200" y2="185" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fff4e6" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#e8b4b8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#c59b6d" stopOpacity="0.95" />
      </linearGradient>
      <radialGradient id={`${gradientId}-glow`} cx="35%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>

    <path
      d="M100 172C100 172 16 116 16 58C16 31 37 12 62 12C78 12 92 20 100 33C108 20 122 12 138 12C163 12 184 31 184 58C184 116 100 172 100 172Z"
      stroke={`url(#${gradientId}-rim)`}
      strokeWidth="1.2"
      strokeDasharray="4 4"
      opacity="0.65"
      transform="scale(1.06) translate(-5.6, -5.2)"
    />

    <path
      d="M100 166C100 166 22 113 22 59C22 34.5 41.5 16 65 16C79.8 16 92.8 23.6 100 35.4C107.2 23.6 120.2 16 135 16C158.5 16 178 34.5 178 59C178 113 100 166 100 166Z"
      fill={`url(#${gradientId}-fill)`}
      stroke={`url(#${gradientId}-rim)`}
      strokeWidth="2.2"
    />

    <path
      d="M100 166C100 166 22 113 22 59C22 34.5 41.5 16 65 16C79.8 16 92.8 23.6 100 35.4C107.2 23.6 120.2 16 135 16C158.5 16 178 34.5 178 59C178 113 100 166 100 166Z"
      fill={`url(#${gradientId}-glow)`}
    />

    <path
      d="M100 154C100 154 31 106 31 59.5C31 39.5 47 24.5 66.5 24.5C79.5 24.5 91.5 31.5 100 43.5C108.5 31.5 120.5 24.5 133.5 24.5C153 24.5 169 39.5 169 59.5C169 106 100 154 100 154Z"
      stroke="#fff7ed"
      strokeOpacity="0.45"
      strokeWidth="1"
    />

    {(mood === 'cracked' || mood === 'pleading') && (
      <path
        d="M100 38 L92 64 L108 86 L95 114 L103 142"
        stroke="#fff6ee"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    )}
  </svg>
);

type CartoonMascotMood =
  | 'holding-heart'
  | 'blushing-letter'
  | 'shy'
  | 'shocked'
  | 'crying'
  | 'running'
  | 'puppy'
  | 'celebrate';

const CartoonMascotSvg: React.FC<{
  mood: CartoonMascotMood;
  className?: string;
}> = ({ mood, className }) => {
  const isHeartEyes = mood === 'holding-heart' || mood === 'celebrate';
  const isShocked = mood === 'shocked';
  const isCrying = mood === 'crying';
  const isPuppy = mood === 'puppy';
  const isRunning = mood === 'running';

  return (
    <div className={`${styles.mascotWrap} ${styles[`mood_${mood}`] || ''} ${className || ''}`}>
      <svg
        viewBox="0 0 140 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.mascotSvg}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="chibiFaceGrad" cx="42%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#fff3d6" />
            <stop offset="65%" stopColor="#ffd482" />
            <stop offset="100%" stopColor="#f3a847" />
          </radialGradient>
          <linearGradient id="miniBouquetHeart" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff9eb8" />
            <stop offset="100%" stopColor="#c92a5b" />
          </linearGradient>
        </defs>

        <ellipse cx="70" cy="118" rx="34" ry="6" fill="rgba(0,0,0,0.32)" />

        {(isHeartEyes || mood === 'blushing-letter' || isPuppy) && (
          <g className={styles.mascotOrbitHearts}>
            <path
              d="M22 34 C22 29, 15 29, 15 34 C15 39, 22 44, 22 44 C22 44, 29 39, 29 34 C29 29, 22 29, 22 34 Z"
              fill="#ff8fab"
            />
            <path
              d="M118 28 C118 23, 111 23, 111 28 C111 33, 118 38, 118 38 C118 38, 125 33, 125 28 C125 23, 118 23, 118 28 Z"
              fill="#f9c784"
            />
          </g>
        )}

        <g className={styles.mascotHead}>
          <circle
            cx="70"
            cy="64"
            r="42"
            fill="url(#chibiFaceGrad)"
            stroke="#fff3db"
            strokeWidth="2.5"
          />

          <path
            d="M58 24 C63 13, 74 14, 72 24 C77 16, 86 19, 80 26"
            stroke="#d97b29"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          <ellipse cx="48" cy="72" rx="7.5" ry="4.5" fill="#ff758f" opacity="0.55" />
          <ellipse cx="92" cy="72" rx="7.5" ry="4.5" fill="#ff758f" opacity="0.55" />

          {isHeartEyes && (
            <g className={styles.mascotHeartEyes}>
              <path
                d="M54 57 C54 52, 47 52, 47 57 C47 62, 54 67, 54 67 C54 67, 61 62, 61 57 C61 52, 54 52, 54 57 Z"
                fill="#d9265a"
              />
              <path
                d="M86 57 C86 52, 79 52, 79 57 C79 62, 86 67, 86 67 C86 67, 93 62, 93 57 C93 52, 86 52, 86 57 Z"
                fill="#d9265a"
              />
            </g>
          )}

          {isShocked && (
            <g>
              <circle cx="54" cy="58" r="7.5" fill="#ffffff" stroke="#3b2314" strokeWidth="2" />
              <circle cx="54" cy="58" r="2.8" fill="#3b2314" />
              <circle cx="86" cy="58" r="7.5" fill="#ffffff" stroke="#3b2314" strokeWidth="2" />
              <circle cx="86" cy="58" r="2.8" fill="#3b2314" />
              <path
                d="M104 42 C104 42, 109 50, 109 53 C109 56, 106.8 58, 104 58 C101.2 58, 99 56, 99 53 C99 50, 104 42, 104 42 Z"
                fill="#7bdff2"
              />
            </g>
          )}

          {isCrying && (
            <g>
              <path d="M47 60 Q54 54 61 60" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M79 60 Q86 54 93 60" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" fill="none" />
              <rect x="48" y="62" width="5" height="24" rx="2.5" fill="#7bdff2" opacity="0.85" className={styles.mascotTear} />
              <rect x="87" y="62" width="5" height="24" rx="2.5" fill="#7bdff2" opacity="0.85" className={styles.mascotTear} />
            </g>
          )}

          {isPuppy && (
            <g>
              <circle cx="54" cy="59" r="7.5" fill="#3b2314" />
              <circle cx="51.5" cy="56.5" r="2.8" fill="#ffffff" />
              <circle cx="56.5" cy="61" r="1.4" fill="#ffffff" />
              <circle cx="86" cy="59" r="7.5" fill="#3b2314" />
              <circle cx="83.5" cy="56.5" r="2.8" fill="#ffffff" />
              <circle cx="88.5" cy="61" r="1.4" fill="#ffffff" />
              <path d="M46 49 L59 52" stroke="#3b2314" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M94 49 L81 52" stroke="#3b2314" strokeWidth="2.4" strokeLinecap="round" />
            </g>
          )}

          {isRunning && (
            <g>
              <path d="M48 54 L60 59 L48 64" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <path d="M92 54 L80 59 L92 64" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
          )}

          {(mood === 'shy' || mood === 'blushing-letter') && (
            <g>
              <circle cx="54" cy="59" r="5" fill="#3b2314" />
              <circle cx="52.3" cy="57.2" r="1.8" fill="#ffffff" />
              <circle cx="86" cy="59" r="5" fill="#3b2314" />
              <circle cx="84.3" cy="57.2" r="1.8" fill="#ffffff" />
            </g>
          )}

          {isShocked && <ellipse cx="70" cy="79" rx="6" ry="8" fill="#5c2314" />}
          {isCrying && <path d="M61 83 Q70 74 79 83" stroke="#5c2314" strokeWidth="3" strokeLinecap="round" fill="none" />}
          {isPuppy && <path d="M64 80 Q70 76 76 80" stroke="#5c2314" strokeWidth="2.8" strokeLinecap="round" fill="none" />}
          {isRunning && <ellipse cx="70" cy="79" rx="7" ry="5" fill="#5c2314" />}
          {(isHeartEyes || mood === 'shy' || mood === 'blushing-letter') && (
            <path
              d="M60 76 Q70 86 80 76"
              stroke="#5c2314"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>

        <g className={styles.mascotHands}>
          <path
            d="M70 112 C70 112, 48 98, 48 86 C48 79, 54 74, 60 74 C64.5 74, 68 76.5, 70 80 C72 76.5, 75.5 74, 80 74 C86 74, 92 79, 92 86 C92 98, 70 112, 70 112 Z"
            fill="url(#miniBouquetHeart)"
            stroke="#fff4e6"
            strokeWidth="1.8"
          />
          <circle cx="47" cy="91" r="7.5" fill="#ffe0a3" stroke="#e09f3e" strokeWidth="1.5" />
          <circle cx="93" cy="91" r="7.5" fill="#ffe0a3" stroke="#e09f3e" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
};

const RingCrestSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="goldBand" x1="25" y1="45" x2="95" y2="105" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f9e2ba" />
        <stop offset="50%" stopColor="#d4a36a" />
        <stop offset="100%" stopColor="#9d6b3b" />
      </linearGradient>
      <linearGradient id="diamondFacet" x1="42" y1="12" x2="78" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#e8f1ff" />
        <stop offset="100%" stopColor="#f8d7e3" />
      </linearGradient>
    </defs>
    <circle cx="60" cy="74" r="28" stroke="url(#goldBand)" strokeWidth="6" />
    <circle cx="60" cy="74" r="25" stroke="#fff6e5" strokeOpacity="0.5" strokeWidth="1" />
    <polygon
      points="60,14 76,28 60,46 44,28"
      fill="url(#diamondFacet)"
      stroke="#ffffff"
      strokeWidth="1.5"
    />
    <polyline points="44,28 60,31 76,28" stroke="#c8d6f0" strokeWidth="1" />
    <line x1="60" y1="14" x2="60" y2="46" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="1" />
    <line x1="60" y1="3" x2="60" y2="9" stroke="#f9e2ba" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="18" x2="39" y2="21" stroke="#f9e2ba" strokeWidth="2" strokeLinecap="round" />
    <line x1="86" y1="18" x2="81" y2="21" stroke="#f9e2ba" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function ProposalExperience({
  partnerName = 'Ashika',
  senderName = 'Sivasankar',
  defaultLanguage = 'ml',
  youtubeVideoId = DEFAULT_UN_VIZHIGALIL_VIDEO_ID,
  onAccept,
}: ProposalExperienceProps) {
  const [lang, setLang] = useState<'ml' | 'en'>(defaultLanguage);
  const [stage, setStage] = useState<'sealed' | 'story' | 'question' | 'accepted'>('sealed');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
  const [playerMountKey, setPlayerMountKey] = useState<number>(0);
  const [noClicks, setNoClicks] = useState(0);
  const [noOffset, setNoOffset] = useState<{ x: number; y: number; rot: number }>({
    x: 0,
    y: 0,
    rot: 0,
  });
  const [isShaking, setIsShaking] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [burstParticles, setBurstParticles] = useState<BurstParticle[]>([]);
  const [acceptedDate, setAcceptedDate] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setLang(defaultLanguage);
  }, [defaultLanguage]);

  useEffect(() => {
    const generated: FloatingHeart[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: (i * 5.7 + 3) % 96,
      size: 12 + (i % 5) * 5,
      duration: 11 + (i % 6) * 2.4,
      delay: -(i * 1.3),
      opacity: 0.16 + (i % 4) * 0.08,
      sway: (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 6),
    }));
    setFloatingHearts(generated);
  }, []);

  const sendYtCommand = (func: 'playVideo' | 'pauseVideo' | 'unMute' | 'mute') => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args: [],
      }),
      '*'
    );
  };

  const activateMusicOnGesture = () => {
    setMusicEnabled(true);
    setPlayerMountKey((k) => k + 1);
    window.setTimeout(() => {
      sendYtCommand('unMute');
      sendYtCommand('playVideo');
    }, 180);
  };

  const toggleMusic = () => {
    if (musicEnabled) {
      setMusicEnabled(false);
      sendYtCommand('pauseVideo');
    } else {
      activateMusicOnGesture();
    }
  };

  const copy = CONTENT[lang];
  const currentNoStage = copy.noStages[Math.min(noClicks, copy.noStages.length - 1)];
  const isConvertedToYes = noClicks >= copy.noStages.length - 1;

  const handleNoAction = () => {
    if (isConvertedToYes) {
      handleAccept();
      return;
    }

    const nextCount = noClicks + 1;
    setNoClicks(nextCount);

    setIsShaking(true);
    window.setTimeout(() => setIsShaking(false), 480);

    if (nextCount >= copy.noStages.length - 1) {
      setNoOffset({ x: 0, y: 0, rot: 0 });
      return;
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 520;
    const maxX = isMobile ? 74 : 135;
    const maxY = isMobile ? 38 : 56;
    const angle = nextCount * 2.2;
    const x = Math.round(Math.cos(angle) * maxX);
    const y = Math.round(Math.sin(angle) * maxY);
    const rot = (nextCount % 2 === 0 ? 1 : -1) * (8 + nextCount * 3);
    setNoOffset({ x, y, rot });
  };

  const handleAccept = () => {
    const particles: BurstParticle[] = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      angle: (360 / 36) * i + (i % 3) * 4,
      distance: 110 + (i % 5) * 42,
      size: 14 + (i % 4) * 6,
      duration: 1.4 + (i % 4) * 0.25,
      hue: i % 3 === 0 ? '#f8c8d4' : i % 3 === 1 ? '#e26d8a' : '#f3d19e',
    }));
    setBurstParticles(particles);
    setAcceptedDate(
      new Date().toLocaleDateString(lang === 'ml' ? 'ml-IN' : 'en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    );
    setStage('accepted');
    onAccept?.();
  };

  const yesScale = Math.min(1 + noClicks * 0.08, 1.38);
  const noScale = isConvertedToYes ? 1 : Math.max(1 - noClicks * 0.11, 0.58);

  const displayPartner = partnerName.trim();
  const displaySender = senderName.trim();
  const cleanVideoId = (youtubeVideoId || DEFAULT_UN_VIZHIGALIL_VIDEO_ID).trim();
  const audioEmbedSrc = `https://www.youtube.com/embed/${encodeURIComponent(
    cleanVideoId
  )}?autoplay=1&loop=1&playlist=${encodeURIComponent(
    cleanVideoId
  )}&controls=0&disablekb=1&fs=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <section
      className={`${styles.viewport} ${lang === 'ml' ? styles.malayalamFont : ''}`}
      lang={lang}
      aria-label="Marriage Proposal"
    >
      {musicEnabled && cleanVideoId && (
        <iframe
          key={`${cleanVideoId}-${playerMountKey}`}
          ref={iframeRef}
          src={audioEmbedSrc}
          title="Un Vizhigalil Vizhuntha Naatkalil Background Music"
          allow="autoplay; encrypted-media"
          className={styles.hiddenAudioFrame}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <div className={styles.ambientGlow} aria-hidden="true" />

      <div className={styles.topControls}>
        <button
          type="button"
          className={`${styles.pillButton} ${musicEnabled ? styles.musicActive : ''}`}
          onClick={toggleMusic}
          aria-label={musicEnabled ? 'Mute background song' : 'Play background song'}
        >
          <span className={styles.pillIcon} aria-hidden="true">
            {musicEnabled ? '🎵' : '🔇'}
          </span>
          <span>{musicEnabled ? copy.musicOnLabel : copy.musicOffLabel}</span>
        </button>

        <button
          type="button"
          className={styles.pillButton}
          onClick={() => setLang((prev) => (prev === 'ml' ? 'en' : 'ml'))}
          aria-label={lang === 'ml' ? 'Switch to English' : 'മലയാളത്തിലേക്ക് മാറ്റുക'}
        >
          <span className={styles.pillIcon} aria-hidden="true">
            🌐
          </span>
          <span>{copy.toggleLabel}</span>
        </button>
      </div>

      <div className={styles.floatingLayer} aria-hidden="true">
        {floatingHearts.map((heart) => (
          <span
            key={heart.id}
            className={styles.floatingHeart}
            style={
              {
                left: `${heart.left}%`,
                width: `${heart.size}px`,
                height: `${heart.size}px`,
                opacity: heart.opacity,
                animationDuration: `${heart.duration}s`,
                animationDelay: `${heart.delay}s`,
                '--sway': `${heart.sway}px`,
              } as React.CSSProperties
            }
          >
            ♥
          </span>
        ))}
      </div>

      <div className={styles.container}>
        {stage === 'sealed' && (
          <div className={`${styles.card} ${styles.fadeIn}`}>
            <p className={styles.kicker}>
              {displayPartner ? `${displayPartner} — ${copy.sealedKicker}` : copy.sealedKicker}
            </p>

            <div className={styles.emblemPair}>
              <div className={styles.heroHeartWrap}>
                <div className={styles.pulseRing} aria-hidden="true" />
                <div className={styles.pulseRingDelayed} aria-hidden="true" />
                <ElegantHeartSvg className={styles.heroHeart} gradientId="sealedHeart" />
              </div>
              <CartoonMascotSvg mood="holding-heart" />
            </div>

            <h1 className={styles.serifHeading}>{copy.sealedHeading}</h1>
            <p className={styles.leadText}>{copy.sealedLead}</p>

            <button
              type="button"
              className={styles.primaryCta}
              onClick={() => {
                activateMusicOnGesture();
                setStage('story');
              }}
            >
              <span>{copy.sealedCta}</span>
              <span className={styles.ctaHeart} aria-hidden="true">
                ♥
              </span>
            </button>
          </div>
        )}

        {stage === 'story' && (
          <div className={`${styles.card} ${styles.storyCard} ${styles.fadeIn}`}>
            <div className={styles.miniCrest}>
              <ElegantHeartSvg className={styles.miniHeart} gradientId="storyHeart" />
              <span className={styles.kicker}>
                {displayPartner ? `${displayPartner} — ${copy.storyKicker}` : copy.storyKicker}
              </span>
            </div>

            <h2 className={styles.serifSubheading}>{copy.storyHeading}</h2>

            <div className={styles.chaptersGrid}>
              {copy.chapters.map((item, idx) => (
                <article key={idx} className={styles.chapterItem}>
                  <span className={styles.chapterTag}>{item.tag}</span>
                  <h3 className={styles.chapterTitle}>{item.title}</h3>
                  <p className={styles.chapterBody}>{item.text}</p>
                </article>
              ))}
            </div>

            <div className={styles.quoteWithMascot}>
              <CartoonMascotSvg mood="blushing-letter" className={styles.quoteMascot} />
              <blockquote className={styles.romanticQuote}>{copy.romanticPromise}</blockquote>
            </div>

            <div className={styles.storyFooter}>
              <button
                type="button"
                className={styles.primaryCta}
                onClick={() => setStage('question')}
              >
                <span>{copy.storyCta}</span>
                <span className={styles.ctaHeart} aria-hidden="true">
                  ♥
                </span>
              </button>
            </div>
          </div>
        )}

        {stage === 'question' && (
          <div
            className={`${styles.card} ${styles.questionCard} ${styles.fadeIn} ${
              isShaking ? styles.comicShake : ''
            }`}
          >
            <div className={styles.emblemPair}>
              <div className={styles.heroHeartWrap}>
                <div className={styles.pulseRing} aria-hidden="true" />
                <ElegantHeartSvg
                  className={`${styles.heroHeart} ${
                    currentNoStage.heartMood === 'dizzy' ? styles.dizzyHeart : ''
                  }`}
                  gradientId="questionHeart"
                  mood={currentNoStage.heartMood}
                />
              </div>
              <CartoonMascotSvg mood={currentNoStage.cartoonMood} />
            </div>

            <p className={styles.kicker}>
              {displayPartner ? `${displayPartner} — ${copy.questionKicker}` : copy.questionKicker}
            </p>
            <h1 className={styles.proposalHeadline}>{currentNoStage.headline}</h1>
            <p className={styles.leadText}>{copy.questionLead}</p>

            {currentNoStage.banner && (
              <div className={styles.funnyToast} role="status" aria-live="polite" key={`${lang}-${noClicks}`}>
                {currentNoStage.banner}
              </div>
            )}

            <div className={styles.decisionRow}>
              <button
                type="button"
                className={styles.yesButton}
                style={{ transform: `scale(${yesScale})` }}
                onClick={handleAccept}
              >
                <span>{copy.yesButton}</span>
              </button>

              <button
                type="button"
                className={isConvertedToYes ? styles.yesButton : styles.noButton}
                style={{
                  transform: `translate(${noOffset.x}px, ${noOffset.y}px) rotate(${noOffset.rot}deg) scale(${noScale})`,
                }}
                onClick={handleNoAction}
              >
                {currentNoStage.buttonLabel}
              </button>
            </div>
          </div>
        )}

        {stage === 'accepted' && (
          <div className={`${styles.card} ${styles.celebrationCard} ${styles.fadeIn}`}>
            <div className={styles.burstOrigin} aria-hidden="true">
              {burstParticles.map((p) => (
                <span
                  key={p.id}
                  className={styles.burstHeart}
                  style={
                    {
                      '--angle': `${p.angle}deg`,
                      '--distance': `${p.distance}px`,
                      fontSize: `${p.size}px`,
                      color: p.hue,
                      animationDuration: `${p.duration}s`,
                    } as React.CSSProperties
                  }
                >
                  ♥
                </span>
              ))}
            </div>

            <div className={styles.emblemPair}>
              <RingCrestSvg className={styles.ringCrest} />
              <CartoonMascotSvg mood="celebrate" />
            </div>

            <p className={styles.kicker}>{copy.acceptedKicker}</p>
            <h1 className={styles.proposalHeadline}>{copy.acceptedHeadline}</h1>
            <p className={styles.leadText}>
              {displayPartner && displaySender
                ? `${displayPartner} & ${displaySender} — ${copy.acceptedLead}`
                : copy.acceptedLead}
            </p>

            {noClicks > 0 && (
              <p className={styles.teaseRecap}>{copy.teaseRecap(noClicks)}</p>
            )}

            <div className={styles.keepsakeBadge}>
              <span className={styles.keepsakeLabel}>{copy.keepsakeLabel}</span>
              <strong className={styles.keepsakeDate}>{acceptedDate || 'Today & Forever'}</strong>
            </div>

            <button
              type="button"
              className={styles.replayLink}
              onClick={() => {
                setNoClicks(0);
                setNoOffset({ x: 0, y: 0, rot: 0 });
                setStage('sealed');
              }}
            >
              {copy.replayLink}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProposalExperience;