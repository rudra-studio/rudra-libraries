import type StarterPresetType from './StarterPresetType';

export default function getPresetTemplateId(preset: StarterPresetType): string {
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
