export function urlFor(href: string, root: string) {
  return /^http/.test(href) ? href : root + href;
}

export function nameFor(url: string) {
  return url.replace(/.*\/(.*)/, '$1');
}
