// Telas em HTML por cima do Canvas: menu, configurações, avisos (pausa, fim de fase) e "gire o celular".

const el = (id) => document.getElementById(id);

export function createScreens({ onClick }) {
  const screens = { menu: el('menu'), settings: el('settings'), intro: el('intro') };
  const overlay = el('overlay');

  return {
    el,
    show(name) {
      for (const [key, node] of Object.entries(screens)) node.classList.toggle('hidden', key !== name);
      if (name !== 'game') this.hideOverlay();
    },
    // buttons: [rótulo, ação, principal?]
    overlay(title, text, buttons) {
      el('ov-title').textContent = title;
      el('ov-text').textContent = text;
      const box = el('ov-buttons');
      box.innerHTML = '';
      buttons.forEach(([label, fn, primary]) => {
        const b = document.createElement('button');
        b.className = `btn${primary ? ' primary' : ''}`;
        b.textContent = label;
        b.onclick = () => { onClick(); fn(); };
        box.appendChild(b);
      });
      overlay.classList.remove('hidden');
      box.querySelector('.primary')?.focus();
    },
    hideOverlay() { overlay.classList.add('hidden'); },
    rotate(show) { el('rotate').classList.toggle('hidden', !show); },
  };
}
