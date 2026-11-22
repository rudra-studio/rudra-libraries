import type FloatingStyleType from './FloatingStyleType';
import type SurfaceKeyType from './SurfaceKeyType';

export interface SmileyyfyBaseTemplate {
  id: string;
  name: string;
  badge: string;
  floatingStyle: FloatingStyleType;
  surfaceKey: SurfaceKeyType;
  description: string;
}
