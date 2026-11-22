import type StarterPresetType from './StarterPresetType';
import type SmileyyfyWidgetDefinition from './SmileyyfyWidgetDefinition';
import type SmileyyfyCanvasBlock from './SmileyyfyCanvasBlock';

export default function buildStarterBlocks(
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
