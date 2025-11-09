// blog-loader.js - Завантаження та відображення поста блогу

// Отримання slug поста з URL
function getPostSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('post');
}

// Завантаження даних поста
async function loadPost(slug) {
  try {
    // ✅ правильний шаблон — тепер підтягує конкретний файл
    const response = await fetch(`data/posts/${slug}.json`);
    
    if (!response.ok) {
      throw new Error(`HTTP помилка! статус: ${response.status}`);
    }
    
    const post = await response.json();
    return post;
  } catch (error) {
    console.error('Помилка завантаження поста:', error);
    throw error;
  }
}

// Рендеринг поста
function renderPost(post) {
  const container = document.getElementById('post-content');
  
  if (!container) {
    console.error('Контейнер #post-content не знайдено');
    return;
  }
  
  // Формуємо теги
  const tagsHTML = post.tags && post.tags.length > 0
    ? `<div class="tags">${post.tags.map(tag => `<span class="chip">#${tag}</span>`).join(' ')}</div>`
    : '';
  
  // Формуємо дату
  const dateHTML = post.date
    ? `<div class="meta">
        Опубліковано: ${window.utils.formatDate(post.date)}
        ${post.readTime ? ` • ${post.readTime} хв читання` : ''}
       </div>`
    : '';
  
  // Основний HTML
  container.innerHTML = `
    <article class="post-article">
      <header class="post-header">
        <h1>${post.title}</h1>
        ${dateHTML}
        ${tagsHTML}
      </header>
      
      <div class="post-content">
        ${post.content}
      </div>
      
      <footer class="post-footer">
        <a href="blog.html" class="btn">← Назад до блогу</a>
      </footer>
    </article>
  `;
  
  // Оновлюємо meta-теги
  updateMetaTags(post);
}

// Оновлення meta-тегів та title
function updateMetaTags(post) {
  // Title
  document.title = `${post.title} — Олександр`;
  
  // Description
  const metaDesc = document.querySelector('meta[name="description"]');
  const description = post.excerpt || post.title;
  
  if (metaDesc) {
    metaDesc.content = description;
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = description;
    document.head.appendChild(meta);
  }
  
  // Open Graph
  updateMetaProperty('og:title', `${post.title} — Олександр`);
  updateMetaProperty('og:description', description);
  updateMetaProperty('og:type', 'article');
  if (post.date) {
    updateMetaProperty('article:published_time', post.date);
  }
}

// Допоміжна функція для оновлення Open Graph тегів
function updateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

// Показ помилки
function showError(message) {
  const container = document.getElementById('post-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-message">
      <h1>😔 ${message}</h1>
      <p>Пост не знайдено або сталася помилка завантаження.</p>
      <a href="blog.html" class="btn btn-accent">← Повернутися до блогу</a>
    </div>
  `;
}

// Показ стану завантаження
function showLoading() {
  const container = document.getElementById('post-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Завантаження поста...</p>
    </div>
  `;
}

// Головна функція ініціалізації
async function initPostPage() {
  const slug = getPostSlug();
  
  if (!slug) {
    showError('Пост не вказано');
    return;
  }
  
  showLoading();
  
  try {
    const post = await loadPost(slug);
    renderPost(post);
  } catch (error) {
    showError('Пост не знайдено');
  }
}

// Запуск при завантаженні сторінки
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPostPage);
} else {
  initPostPage();
}