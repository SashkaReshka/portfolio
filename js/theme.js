// theme.js - Керування темною/світлою темою

// Застосування теми
function applyTheme(theme) {
  const html = document.documentElement;
  
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  
  // Зберігаємо вибір в localStorage
  localStorage.setItem('theme', theme);
  
  // Оновлюємо кнопки (якщо є)
  updateThemeButtons();
}

// Встановлення конкретної теми (викликається з кнопок)
function setTheme(theme) {
  applyTheme(theme);
}

// Переключення теми (для сумісності)
function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
}

// Оновлення стану кнопок теми
function updateThemeButtons() {
  const isDark = document.documentElement.classList.contains('dark');
  const lightBtn = document.getElementById('lightThemeBtn');
  const darkBtn = document.getElementById('darkThemeBtn');
  
  if (lightBtn && darkBtn) {
    // Активна кнопка має клас 'active'
    if (isDark) {
      lightBtn.classList.remove('active');
      darkBtn.classList.add('active');
    } else {
      lightBtn.classList.add('active');
      darkBtn.classList.remove('active');
    }
  }
}

// Ініціалізація теми при завантаженні
function initTheme() {
  // Перевіряємо збережений вибір
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme) {
    applyTheme(savedTheme);
    return;
  }
  
  // Визначаємо системну тему
  const prefersDark = window.matchMedia && 
                      window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  applyTheme(prefersDark ? 'dark' : 'light');
}

// Відстеження зміни системної теми
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    // Тільки якщо користувач не вибирав тему вручну
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// Запуск при завантаженні сторінки
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

// Глобальні функції для кнопок
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.updateThemeButtons = updateThemeButtons;