// Colors.ts

export const PRIMARY_COLOR = '#007bff';
export const SECONDARY_COLOR = '#6c757d';
export const SUCCESS_COLOR = '#28a745';
export const DANGER_COLOR = '#dc3545';
export const WARNING_COLOR = '#ffc107';
export const INFO_COLOR = '#17a2b8';
export const LIGHT_COLOR = '#f8f9fa';
export const DARK_COLOR = '#343a40';

export type Color = PRIMARY_COLOR | SECONDARY_COLOR | SUCCESS_COLOR | DANGER_COLOR | WARNING_COLOR | INFO_COLOR | LIGHT_COLOR | DARK_COLOR;

export function getColorValue(color: Color): string {
  switch (color) {
    case PRIMARY_COLOR:
      return 'primary';
    case SECONDARY_COLOR:
      return 'secondary';
    case SUCCESS_COLOR:
      return 'success';
    case DANGER_COLOR:
      return 'danger';
    case WARNING_COLOR:
      return 'warning';
    case INFO_COLOR:
      return 'info';
    case LIGHT_COLOR:
      return 'light';
    case DARK_COLOR:
      return 'dark';
    default:
      throw new Error('Invalid color');
  }
}