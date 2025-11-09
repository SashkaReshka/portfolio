// utils.js - Допоміжні функції

// Форматування дати
function formatDate(dateString, locale = 'uk-UA') {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Debounce для пошуку (затримка виконання функції)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Безпечна вставка HTML (захист від XSS)
function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Розрахунок часу читання (слова/хвилину)
function calculateReadTime(text, wordsPerMinute = 200) {
  const wordCount = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;
}

// Генерація slug з тексту
function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яіїєґ0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Скорочення тексту до певної довжини
function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength).trim() + '...';
}

// Функція пошуку по масиву об'єктів
function searchItems(items, query, searchFields = ['title', 'description', 'tags']) {
  if (!query || query.trim() === '') {
    return items;
  }
  
  const searchTerm = query.toLowerCase().trim();
  
  return items.filter(item => {
    // Шукаємо в кожному полі
    return searchFields.some(field => {
      const value = item[field];
      
      if (!value) return false;
      
      // Якщо поле - масив (наприклад, tags)
      if (Array.isArray(value)) {
        return value.some(v => 
          v.toLowerCase().includes(searchTerm)
        );
      }
      
      // Якщо поле - рядок
      return value.toLowerCase().includes(searchTerm);
    });
  });
}

// Фільтрація по тегу
function filterByTag(items, tag) {
  if (!tag || tag === 'all') {
    return items;
  }
  
  return items.filter(item => {
    if (!item.tags) return false;
    return item.tags.some(t => 
      t.toLowerCase() === tag.toLowerCase()
    );
  });
}

// Отримання унікальних тегів з масиву об'єктів
function getAllTags(items) {
  const tagsSet = new Set();
  
  items.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach(tag => tagsSet.add(tag));
    }
  });
  
  return Array.from(tagsSet).sort();
}

// Експорт функцій для глобального використання
window.utils = {
  formatDate,
  debounce,
  sanitizeHTML,
  calculateReadTime,
  generateSlug,
  truncate,
  searchItems,        // ← Додали
  filterByTag,        // ← Додали
  getAllTags          // ← Додали
};