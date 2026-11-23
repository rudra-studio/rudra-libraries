import React, { useEffect, useMemo, useState } from 'react';
import type SmileyyfyWidgetCategory from '../../utils/SmileyyfyWidgetCategory';
import type StorySpriteScene from '../../utils/StorySpriteScene';
import type FloatingStyleType from '../../utils/FloatingStyleType';
import type StarterPresetType from '../../utils/StarterPresetType';
import type SmileyyfyLanguageOption from '../../utils/SmileyyfyLanguageOption';
import type SmileyyfyBaseTemplate from '../../utils/SmileyyfyBaseTemplate';
import type SmileyyfyWidgetField from '../../utils/SmileyyfyWidgetField';
import type SmileyyfyWidgetDefinition from '../../utils/SmileyyfyWidgetDefinition';
import type SmileyyfyCanvasBlock from '../../utils/SmileyyfyCanvasBlock';
import type SmileyyfyPageSnapshot from '../../utils/SmileyyfyPageSnapshot';
import defaultBaseTemplates from '../../utils/defaultBaseTemplates';
import defaultLanguages from '../../utils/defaultLanguages';
import defaultWidgetRegistry from '../../utils/defaultWidgetRegistry';
import buildStarterBlocks from '../../utils/buildStarterBlocks';
import getPresetTemplateId from '../../utils/getPresetTemplateId';
import suggestedLanguages from '../../utils/suggestedLanguages';
import extractYouTubeId from '../../utils/extractYouTubeId';
import styles from './styles.module.scss';

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
    const seen = new Set(defaultWidgetRegistry.map((w) => w.type));
    return [...defaultWidgetRegistry, ...extras.filter((w) => w && w.type && !seen.has(w.type))];
  }, [customWidgets]);

  const templates = useMemo(() => {
    const extras = Array.isArray(customTemplates) ? customTemplates : [];
    const seen = new Set(defaultBaseTemplates.map((t) => t.id));
    return [...defaultBaseTemplates, ...extras.filter((t) => t && t.id && !seen.has(t.id))];
  }, [customTemplates]);

  const [languages, setLanguages] = useState<SmileyyfyLanguageOption[]>(() =>
    Array.isArray(initialLanguages) && initialLanguages.length > 0 ? initialLanguages : defaultLanguages
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
              {suggestedLanguages.filter((s) => !languages.some((l) => l.code === s.code)).map((s) => (
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
