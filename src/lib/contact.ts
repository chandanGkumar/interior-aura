/**
 * Single source of truth for the studio's public contact details.
 *
 * These were previously hardcoded in five separate files, which is how a
 * developer's personal address ended up published as the business contact.
 * Change them here (or via env) and every surface follows.
 */

/** Where website enquiries are delivered. Override with CONTACT_TO_EMAIL. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || 'soumaysinghal11@gmail.com';

/** Digits only, including country code — required for tel: links to work abroad. */
export const CONTACT_PHONE_E164 = '+918923033977';

/** Human-readable form for display. */
export const CONTACT_PHONE_DISPLAY = '+91 89230 33977';

export const INSTAGRAM_URL = 'https://www.instagram.com/interior_aura/?hl=en';

export const STUDIO_ADDRESS = {
  line1: 'Shop No. 90, Muradnagar',
  line2: 'Ghaziabad, India 201206',
};
