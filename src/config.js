// ---- Grading configuration ----
// Your Google Gemini API key (used only for scoring your essays).
// Set it in the .env file at the project root — see .env.example.
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ?? ''

// Models are tried in order; if all fail, the built-in rubric engine scores instead.
export const GEMINI_MODELS = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-flash-latest']

// ---- Official task timings ----
export const EMAIL_SECONDS = 7 * 60
export const DISCUSSION_SECONDS = 10 * 60

export const EMAIL_TARGET_WORDS = 110 // ETS guidance: about 100-120 words
export const DISCUSSION_MIN_WORDS = 100 // ETS: an effective response has at least 100 words
