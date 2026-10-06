/* Progressive enhancement: navigation and learning content work without JS. */
(() => {
  const links = [...document.querySelectorAll('.toc nav a[href^="#"]')];
  if (!links.length || !('IntersectionObserver' in window)) return;
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setCurrent = id => links.forEach(link => {
    if (link.getAttribute('href') === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const visible = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
    const current = sections.find(section => visible.has(section));
    if (current) setCurrent(current.id);
  }, { rootMargin: '-120px 0px -45% 0px', threshold: 0 });
  sections.forEach(section => observer.observe(section));
  links.forEach(link => link.addEventListener('click', () => setCurrent(link.hash.slice(1))));
  window.addEventListener('beforeprint', () => {
    document.querySelectorAll('details').forEach(item => { item.dataset.wasOpen = String(item.open); item.open = true; });
  });
  window.addEventListener('afterprint', () => {
    document.querySelectorAll('details').forEach(item => { item.open = item.dataset.wasOpen === 'true'; delete item.dataset.wasOpen; });
  });
})();
