export interface CookieOptions {
  expires?: number | 'never' | { days?: number; hours?: number; minutes?: number };
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}
