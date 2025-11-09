// project-loader.js - Завантаження та відображення проєкту

// Отримання параметра з URL
function getProjectSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get('project');
}

// Завантаження даних проєкту
async function loadProject(slug) {
  try {
    const response = await fetch('data/projects.json');
    
    if (!response.ok) {
      throw new Error(`HTTP помилка! статус: ${response.status}`);
    }
    
    const projects = await response.json();
    const project = projects.find(p => p.slug === slug);
    
    if (!project) {
      throw new Error('Проєкт не знайдено');
    }
    
    return project;
  } catch (error) {
    console.error('Помилка завантаження проєкту:', error);
    throw error;
  }
}

// Рендеринг проєкту
function renderProject(project) {
  const container = document.getElementById('project-content');
  
  if (!container) {
    console.error('Контейнер #project-content не знайдено');
    return;
  }
  
  // Формуємо теги
  const tagsHTML = project.tags && project.tags.length > 0
    ? `<div class="tags">${project.tags.map(tag => `<span class="chip">#${tag}</span>`).join(' ')}</div>`
    : '';
  
  // Формуємо дату
  const dateHTML = project.date
    ? `<div class="meta">Опубліковано: ${window.utils.formatDate(project.date)}</div>`
    : '';
  
  // Основний HTML
  container.innerHTML = `
    <article class="project-article">
      <header class="project-header">
        <h1>${project.title}</h1>
        <div class="meta">${project.role}</div>
        ${dateHTML}
        ${tagsHTML}
      </header>
      
      ${project.thumbnail ? `
        <div class="project-image">
          <img src="${project.thumbnail}" alt="${project.title}" loading="lazy" />
        </div>
      ` : ''}
      
      <div class="project-content">
        ${project.content}
      </div>
      
      ${project.link && project.link !== '#' ? `
        <footer class="project-footer">
          <a href="${project.link}" class="btn btn-accent" target="_blank" rel="noopener noreferrer">
            Відкрити проєкт →
          </a>
        </footer>
      ` : ''}
    </article>
  `;
  
  // Оновлюємо meta-теги
  updateMetaTags(project);
}

// Оновлення meta-тегів та title
function updateMetaTags(project) {
  // Title
  document.title = `${project.title} — Олександр`;
  
  // Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = project.description || '';
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = project.description || '';
    document.head.appendChild(meta);
  }
  
  // Open Graph
  updateMetaProperty('og:title', `${project.title} — Олександр`);
  updateMetaProperty('og:description', project.description || '');
  if (project.thumbnail) {
    updateMetaProperty('og:image', project.thumbnail);
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
  const container = document.getElementById('project-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="error-message">
      <h1>😔 ${message}</h1>
      <p>Проєкт не знайдено або сталася помилка завантаження.</p>
      <a href="projects.html" class="btn btn-accent">← Повернутися до проєктів</a>
    </div>
  `;
}

// Показ стану завантаження
function showLoading() {
  const container = document.getElementById('project-content');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading-state">
      <div class="spinner"></div>
      <p>Завантаження проєкту...</p>
    </div>
  `;
}

// Головна функція ініціалізації
async function initProjectPage() {
  const slug = getProjectSlug();
  
  if (!slug) {
    showError('Проєкт не вказано');
    return;
  }
  
  showLoading();
  
  try {
    const project = await loadProject(slug);
    renderProject(project);
  } catch (error) {
    showError('Проєкт не знайдено');
  }
}

// Запуск при завантаженні сторінки
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectPage);
} else {
  initProjectPage();
}