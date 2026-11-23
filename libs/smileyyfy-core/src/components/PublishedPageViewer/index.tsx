import React, { useEffect, useMemo, useState } from 'react';
import type SmileyyfyPublishedPageData from '../../utils/SmileyyfyPublishedPageData';
import type StorySpriteScene from '../../utils/StorySpriteScene';
import type FloatingStyleType from '../../utils/FloatingStyleType';
import defaultBaseTemplates from '../../utils/defaultBaseTemplates';
import defaultLanguages from '../../utils/defaultLanguages';
import extractYouTubeId from '../../utils/extractYouTubeId';
import styles from './styles.module.scss';

type PublishedBlock = NonNullable<SmileyyfyPublishedPageData['blocks']>[number];

interface PublishedPageViewerProps {
  /** @select|light|dark */
  themeMode?: 'light' | 'dark';
  /** @type|json */
  pageData?: SmileyyfyPublishedPageData | string;
  /** @select|desktop|mobile */
  viewportMode?: 'desktop' | 'mobile';
  /** @type|string */
  initialLanguage?: string;
  /** @type|function */
  onRsvpSubmit?: (payload: { blockId: string; guestName: string; party: number }) => void;
  /** @type|function */
  onProposalAccept?: (payload: { blockId: string; dodgeCount: number }) => void;
}

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

const SAMPLE_PAGE_DATA: SmileyyfyPublishedPageData = {
  templateId: 'tpl_blush_hearts',
  defaultLanguage: 'en',
  languages: defaultLanguages,
  blocks: [
    {
      id: 'blk_hero_1',
      type: 'hero_header',
      data: {
        badge: 'WEDDING INVITATION',
        names: 'Aarav & Meera',
        subtitle: 'Together with their families, invite you to celebrate',
      },
      translations: {
        ta: {
          badge: 'திருமண அழைப்பிதழ்',
          names: 'ஆரவ் & மீரா',
          subtitle: 'குடும்பத்தாருடன் இணைந்து எங்கள் திருமண விழாவிற்கு அன்புடன் அழைக்கிறோம்',
        },
      },
    },
    {
      id: 'blk_event_1',
      type: 'event_details',
      data: {
        date: '2026-12-20',
        time: '06:30 PM',
        venue: 'The Lotus Pavilion, ECR, Chennai',
      },
      translations: {
        ta: {
          time: 'மாலை 06:30 மணி',
          venue: 'தி லோட்டஸ் பெவிலியன், இ.சி.ஆர், சென்னை',
        },
      },
    },
  ],
};

function parsePageData(input?: SmileyyfyPublishedPageData | string): SmileyyfyPublishedPageData {
  if (!input) return SAMPLE_PAGE_DATA;
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (parsed && typeof parsed === 'object') {
        return parsed as SmileyyfyPublishedPageData;
      }
    } catch {
      return SAMPLE_PAGE_DATA;
    }
  }
  if (typeof input === 'object') {
    return input;
  }
  return SAMPLE_PAGE_DATA;
}

function CountdownView({ label, targetDate }: { label: string; targetDate: string }) {
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

function SpriteSceneView({
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
            <div className={styles.customStub}>🖼️ Horizontal sprite sheet</div>
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

function YouTubeBlockView({
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
        {mediaMode === 'audio' ? '🎵' : '🎬'} No valid YouTube URL or video ID configured.
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

function PublishedPageViewer({
  themeMode = 'light',
  pageData,
  viewportMode = 'desktop',
  initialLanguage,
  onRsvpSubmit,
  onProposalAccept,
}: PublishedPageViewerProps) {
  const snapshot = useMemo(() => parsePageData(pageData), [pageData]);
  const languages = useMemo(
    () =>
      Array.isArray(snapshot.languages) && snapshot.languages.length > 0
        ? snapshot.languages
        : defaultLanguages,
    [snapshot.languages]
  );
  const defaultLang = snapshot.defaultLanguage || languages[0]?.code || 'en';
  const [activeLang, setActiveLang] = useState<string>(initialLanguage || defaultLang);

  useEffect(() => {
    setActiveLang(initialLanguage || defaultLang);
  }, [initialLanguage, defaultLang]);

  const template = useMemo(
    () => defaultBaseTemplates.find((t) => t.id === snapshot.templateId) || defaultBaseTemplates[0],
    [snapshot.templateId]
  );
  const glyphs = FLOATING_GLYPHS[template.floatingStyle] || FLOATING_GLYPHS.hearts;
  const blocks = Array.isArray(snapshot.blocks) ? snapshot.blocks : [];

  const [acceptedMap, setAcceptedMap] = useState<Record<string, boolean>>({});
  const [dodgeMap, setDodgeMap] = useState<Record<string, { count: number; top: number; left: number }>>({});
  const [rsvpSentMap, setRsvpSentMap] = useState<Record<string, string>>({});

  const getFieldText = (block: PublishedBlock, key: string, fallback = ''): string => {
    const data = block.data || {};
    if (activeLang !== defaultLang) {
      const translated = block.translations?.[activeLang]?.[key];
      if (typeof translated === 'string' && translated.trim() !== '') {
        return translated;
      }
    }
    const raw = data[key];
    return raw !== undefined && raw !== null ? String(raw) : fallback;
  };

  const renderBlock = (block: PublishedBlock, idx: number) => {
    const key = block.id || `pub_blk_${idx}`;
    const d = block.data || {};

    if (block.type === 'text_banner') {
      return (
        <div className={styles.cardHero}>
          <div className={styles.ornament}>✦ ❀ ✦</div>
          <h2 className={styles.heroNames}>{getFieldText(block, 'heading', 'Celebration Title')}</h2>
          <p className={styles.heroSub}>{getFieldText(block, 'subtext', '')}</p>
        </div>
      );
    }

    if (block.type === 'story_paragraph') {
      return (
        <div className={styles.letterBox}>
          <div className={styles.letterGreeting}>{getFieldText(block, 'title', 'Our Story')}</div>
          <p className={styles.letterBody}>{getFieldText(block, 'body', '')}</p>
        </div>
      );
    }

    if (block.type === 'rich_quote') {
      return (
        <blockquote className={styles.quoteCard}>
          <p className={styles.quoteText}>{getFieldText(block, 'quote', '')}</p>
          <footer className={styles.quoteAuthor}>— {getFieldText(block, 'author', '')}</footer>
        </blockquote>
      );
    }

    if (block.type === 'milestone_timeline') {
      const steps = [
        { title: getFieldText(block, 'step1Title'), note: getFieldText(block, 'step1Note') },
        { title: getFieldText(block, 'step2Title'), note: getFieldText(block, 'step2Note') },
        { title: getFieldText(block, 'step3Title'), note: getFieldText(block, 'step3Note') },
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
          <span className={styles.heroBadge}>{getFieldText(block, 'badge', 'INVITATION')}</span>
          <h2 className={styles.heroNames}>{getFieldText(block, 'names', 'Your Names')}</h2>
          <p className={styles.heroSub}>{getFieldText(block, 'subtitle', '')}</p>
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
            <strong>⏰ {getFieldText(block, 'time', 'TBD')}</strong>
          </div>
          <div className={styles.detailCellWide}>
            <span className={styles.detailLbl}>VENUE</span>
            <strong>📍 {getFieldText(block, 'venue', 'Location TBD')}</strong>
          </div>
        </div>
      );
    }

    if (block.type === 'countdown_timer') {
      return (
        <CountdownView
          label={getFieldText(block, 'label', 'Countdown')}
          targetDate={String(d.targetDate || '')}
        />
      );
    }

    if (block.type === 'dress_code_card') {
      return (
        <div className={styles.dressBox}>
          <span className={styles.heroBadge}>👗 DRESS CODE</span>
          <div className={styles.dressTheme}>{getFieldText(block, 'dressCode', 'Festive Attire')}</div>
          <p className={styles.heroSub}>{getFieldText(block, 'note', '')}</p>
        </div>
      );
    }

    if (block.type === 'rsvp_card') {
      const sent = rsvpSentMap[key];
      return (
        <div className={styles.rsvpBox}>
          <h3 className={styles.blockHeading}>📋 {getFieldText(block, 'heading', 'Will You Join Us?')}</h3>
          {sent ? (
            <div className={styles.rsvpDone}>✅ Thanks, {sent}! Your RSVP is recorded.</div>
          ) : (
            <form
              className={styles.rsvpInlineForm}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const guestName = String(formData.get('guestName') || 'Guest').trim() || 'Guest';
                const party = Math.max(1, Math.min(10, Number(formData.get('party')) || 1));
                setRsvpSentMap((prev) => ({ ...prev, [key]: guestName }));
                onRsvpSubmit?.({ blockId: key, guestName, party });
              }}
            >
              <input name="guestName" type="text" required placeholder="Your name" />
              {Boolean(d.allowPlusOne) && <input name="party" type="number" min={1} max={10} defaultValue={1} />}
              <button type="submit" className={styles.primaryMiniBtn}>
                {getFieldText(block, 'buttonLabel', 'Confirm RSVP')}
              </button>
            </form>
          )}
        </div>
      );
    }

    if (block.type === 'love_letter') {
      return (
        <div className={styles.letterBox}>
          <div className={styles.letterGreeting}>{getFieldText(block, 'greeting', 'Dear You,')}</div>
          <p className={styles.letterBody}>{getFieldText(block, 'body', '')}</p>
          <div className={styles.letterSig}>— {getFieldText(block, 'signature', 'Forever Yours')}</div>
        </div>
      );
    }

    if (block.type === 'photo_polaroids') {
      const items = [
        { url: String(d.photoOneUrl || ''), cap: getFieldText(block, 'captionOne', 'Memory 1'), icon: '💑', rot: -2.5 },
        { url: String(d.photoTwoUrl || ''), cap: getFieldText(block, 'captionTwo', 'Memory 2'), icon: '💍', rot: 2.5 },
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
      const isAccepted = Boolean(acceptedMap[key]);
      const dodge = dodgeMap[key] || { count: 0, top: 50, left: 68 };
      const flyNo = () => {
        setDodgeMap((prev) => ({
          ...prev,
          [key]: {
            count: (prev[key]?.count || 0) + 1,
            top: 18 + Math.floor(Math.random() * 64),
            left: 14 + Math.floor(Math.random() * 70),
          },
        }));
      };
      return (
        <div className={styles.proposalBox}>
          <h3 className={styles.proposalQ}>
            {isAccepted
              ? getFieldText(block, 'acceptedText', 'YAY!! 💍💖')
              : getFieldText(block, 'question', 'Will You Marry Me?')}
          </h3>
          {isAccepted ? (
            <button
              type="button"
              className={styles.ghostMiniBtn}
              onClick={() => setAcceptedMap((prev) => ({ ...prev, [key]: false }))}
            >
              ↺ Replay
            </button>
          ) : (
            <div className={styles.flyingArena}>
              <button
                type="button"
                className={styles.yesMiniBtn}
                style={{ transform: `scale(${Math.min(1.35, 1 + dodge.count * 0.07)})` }}
                onClick={() => {
                  setAcceptedMap((prev) => ({ ...prev, [key]: true }));
                  onProposalAccept?.({ blockId: key, dodgeCount: dodge.count });
                }}
              >
                {getFieldText(block, 'yesLabel', 'Yes! 💖')}
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
                  ? getFieldText(block, 'noLabel', 'No 🙈')
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
        <SpriteSceneView
          scene={sceneVal}
          caption={getFieldText(block, 'caption', '')}
          leftEmoji={String(d.leftEmoji || '🤵')}
          rightEmoji={String(d.rightEmoji || '👰')}
          spriteSheetUrl={String(d.spriteSheetUrl || '')}
        />
      );
    }

    if (block.type === 'youtube_audio') {
      return (
        <YouTubeBlockView
          mediaMode="audio"
          youtubeUrl={String(d.youtubeUrl || '')}
          title={getFieldText(block, 'title', 'Background Song')}
          autoPlay={Boolean(d.autoPlay)}
          loop
        />
      );
    }

    if (block.type === 'youtube_video') {
      return (
        <YouTubeBlockView
          mediaMode="video"
          youtubeUrl={String(d.youtubeUrl || '')}
          title={getFieldText(block, 'title', 'Our Story Video')}
          autoPlay={false}
          loop={Boolean(d.loop)}
        />
      );
    }

    return (
      <div className={styles.customFallback}>
        <strong>🧩 {block.type}</strong>
        <p>
          {Object.keys(d)
            .map((k) => getFieldText(block, k))
            .filter(Boolean)
            .join(' • ')}
        </p>
      </div>
    );
  };

  return (
    <div className={`${styles.outer} ${styles[`mode_${themeMode}`] || styles.mode_light}`}>
      <div
        className={`${styles.pageSurface} ${styles[`surf_${template.surfaceKey}`] || styles.surf_blush} ${
          viewportMode === 'mobile' ? styles.widthMobile : styles.widthDesktop
        }`}
      >
        <div className={styles.floatingLayer} aria-hidden="true">
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={`${template.id}-${i}`}
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

        <div className={styles.pageStack}>
          {languages.length > 1 && (
            <div className={styles.langBar} role="group" aria-label="Switch page language">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  className={`${styles.langBtn} ${activeLang === lang.code ? styles.activeLang : ''}`}
                  onClick={() => setActiveLang(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          {blocks.map((block, idx) => (
            <div key={block.id || `pub_blk_${idx}`} className={styles.blockCard}>
              {renderBlock(block, idx)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PublishedPageViewer;
