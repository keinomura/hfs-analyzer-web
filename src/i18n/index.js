import { messages } from './messages.js';

const STORAGE_KEY = 'hfs-analyzer-lang';
const DEFAULT_LANGUAGE = 'en';
const SUPPORTED_LANGUAGES = ['en', 'ja'];

let currentLanguage = DEFAULT_LANGUAGE;

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

function interpolate(template, params = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

function normalizeLanguage(input) {
  if (!input) return DEFAULT_LANGUAGE;
  const short = input.toLowerCase().split('-')[0];
  return SUPPORTED_LANGUAGES.includes(short) ? short : DEFAULT_LANGUAGE;
}

function getInitialLanguage() {
  const savedRaw = localStorage.getItem(STORAGE_KEY);
  if (savedRaw) return normalizeLanguage(savedRaw);
  return normalizeLanguage(navigator.language || navigator.languages?.[0] || DEFAULT_LANGUAGE);
}

export function t(key, params = {}) {
  const value = getByPath(messages[currentLanguage], key) ?? getByPath(messages.en, key);
  if (value === undefined) return key;
  return interpolate(value, params);
}

export function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    el.textContent = t(key);
  });

  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (!key) return;
    el.innerHTML = t(key);
  });

  root.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (!key) return;
    const translated = t(key);
    el.setAttribute('title', translated);
    if (el.classList.contains('tooltip-anchor') || el.dataset.tooltip !== undefined) {
      el.dataset.tooltip = translated;
    }
  });

  document.title = t('app.title');
  document.documentElement.lang = currentLanguage;
}

export function setLanguage(language) {
  const normalized = normalizeLanguage(language);
  if (normalized === currentLanguage) return;

  currentLanguage = normalized;
  localStorage.setItem(STORAGE_KEY, currentLanguage);
  applyTranslations(document);

  document.dispatchEvent(
    new CustomEvent('app:language-changed', {
      detail: { language: currentLanguage },
    }),
  );
}

export function getLanguage() {
  return currentLanguage;
}

export function initI18n() {
  currentLanguage = getInitialLanguage();
  applyTranslations(document);

  const languageSelect = document.getElementById('lang-select');
  if (!languageSelect) return;

  languageSelect.value = currentLanguage;
  languageSelect.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });
}
