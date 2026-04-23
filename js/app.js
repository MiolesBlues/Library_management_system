const contrastToggle = document.getElementById('contrastToggle');
const contrastStorageKey = 'libraryms-contrast-mode';

function setContrastMode(enabled) {
  document.body.classList.toggle('high-contrast', enabled);

  if (contrastToggle) {
    contrastToggle.setAttribute('aria-pressed', String(enabled));
    contrastToggle.textContent = enabled ? 'Standard Contrast' : 'High Contrast';
  }
}

const savedContrastMode = localStorage.getItem(contrastStorageKey) === 'true';
setContrastMode(savedContrastMode);

if (contrastToggle) {
  contrastToggle.addEventListener('click', () => {
    const isEnabled = !document.body.classList.contains('high-contrast');
    setContrastMode(isEnabled);
    localStorage.setItem(contrastStorageKey, String(isEnabled));
  });
}
