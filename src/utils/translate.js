export function t(el, lang) {
  if (!el) return ''
  return lang === 'fr'
    ? el.getAttribute('data-fr') || el.getAttribute('data-en')
    : el.getAttribute('data-en')
}

// Use this in JSX directly for inline text nodes
export function txt(en, fr, lang) {
  return lang === 'fr' ? fr : en
}