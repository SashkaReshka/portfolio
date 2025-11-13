// breadcrumbs.js - Генерація хлібних крихт для навігації

/**
 * Генерує HTML для хлібних крихт на основі поточної сторінки
 * @param {Object} options - Опції для налаштування breadcrumbs
 * @param {string} options.currentPage - Назва поточної сторінки
 * @param {string} options.parentPage - Назва батьківської сторінки (опціонально)
 * @param {string} options.parentUrl - URL батьківської сторінки (опціонально)
 * @returns {string} HTML для breadcrumbs
 */
function generateBreadcrumbs(options = {}) {
  const { currentPage, parentPage, parentUrl } = options;
  
  let html = `
    <nav class="breadcrumbs" aria-label="Навігаційні крихти">
      <div class="breadcrumb-item">
        <a href="index.html" class="breadcrumb-link breadcrumb-home" title="На головну">
          🏠
        </a>
      </div>
  `;
  
  if (parentPage && parentUrl) {
    html += `
      <div class="breadcrumb-item">
        <span class="breadcrumb-separator">›</span>
        <a href="${parentUrl}" class="breadcrumb-link">${parentPage}</a>
      </div>
    `;
  }
  
  if (currentPage) {
    html += `
      <div class="breadcrumb-item">
        <span class="breadcrumb-separator">›</span>
        <span class="breadcrumb-current">${currentPage}</span>
      </div>
    `;
  }
  
  html += `</nav>`;
  return html;
}

/**
 * Автоматично визначає breadcrumbs на основі URL та контенту
 * @param {Object} customData - Додаткові дані (наприклад, назва елемента з JSON)
 */
function initBreadcrumbs(customData = {}) {
  const container = document.getElementById('breadcrumbs-container');
  if (!container) return;
  
  const pathname = window.location.pathname;
  const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
  
  let breadcrumbsHTML = '';
  
  switch (filename) {
    case 'projects.html':
      breadcrumbsHTML = generateBreadcrumbs({ currentPage: '💡 Інтерактивні крафти' });
      break;
      
    case 'project.html':
      breadcrumbsHTML = generateBreadcrumbs({
        currentPage: customData.projectTitle || 'Проєкт',
        parentPage: '💡 Інтерактивні крафти',
        parentUrl: 'projects.html'
      });
      break;

    // ✅ ДОДАНО: список GPTs
    case 'gpts.html':
      breadcrumbsHTML = generateBreadcrumbs({ currentPage: 'GPTs Lab' });
      break;

    // ✅ ДОДАНО: детальна сторінка GPT
    case 'gpt.html':
      breadcrumbsHTML = generateBreadcrumbs({
        currentPage: customData.gptTitle || customData.currentPage || 'GPT',
        parentPage: 'GPTs Lab',
        parentUrl: 'gpts.html'
      });
      break;
      
    case 'blog.html':
      breadcrumbsHTML = generateBreadcrumbs({ currentPage: 'Блог' });
      break;
      
    case 'post.html':
      breadcrumbsHTML = generateBreadcrumbs({
        currentPage: customData.postTitle || 'Стаття',
        parentPage: 'Блог',
        parentUrl: 'blog.html'
      });
      break;
      
    default:
      breadcrumbsHTML = '';
  }
  
  container.innerHTML = breadcrumbsHTML;
}

window.generateBreadcrumbs = generateBreadcrumbs;
window.initBreadcrumbs = initBreadcrumbs;
