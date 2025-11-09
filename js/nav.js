// nav.js - Генерація навігації на всіх сторінках

let projectsData = [];

// Завантаження даних проєктів
async function loadProjectsData() {
  try {
    const response = await fetch('data/projects.json');
    
    if (!response.ok) {
      throw new Error(`HTTP помилка! статус: ${response.status}`);
    }
    
    projectsData = await response.json();
    return projectsData;
  } catch (error) {
    console.error('Помилка завантаження проєктів:', error);
    return [];
  }
}

// Генерація HTML навігації
function generateNavHTML(projects) {
  
  return `
    <div class="aside-inner">
      <!-- Логотип і tagline -->
      <div class="brand">
        <a href="index.html" class="logo-link">
          <img 
            src="assets/images/logo.png" 
            alt="Логотип" 
            class="logo-image"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="logo-placeholder">
            <div class="logo-initial">О</div>
          </div>
        </a>
        <p class="tagline">Product • Frontend • Energy/CCTV</p>
      </div>
      
      <!-- Навігація -->
      <nav>
        <div class="nav-title">Навігація</div>
        <a class="nav-link" href="index.html">🏠 <span>Головна</span></a>
        
        <a class="nav-link" href="projects.html">🧪 <span>Interactive Lab</span></a>
        
        <a class="nav-link" href="gpts.html">🤖 <span>GPTs Lab</span></a>
        
        <a class="nav-link" href="blog.html">📝 <span>Блог</span></a>
      </nav>
      
      <div class="grow"></div>
      
      <!-- Футер -->
      <div class="cta">
        <a class="btn btn-accent" href="index.html#contact">Зв'язатися</a>
        
        <!-- Переключатель теми (компактний) -->
        <div class="theme-toggle-compact">
          <button class="btn theme-btn" id="lightThemeBtn" title="Світла тема" aria-label="Світла тема" 
                  onclick="setTheme('light')">☀️</button>
          <button class="btn theme-btn" id="darkThemeBtn" title="Темна тема" aria-label="Темна тема" 
                  onclick="setTheme('dark')">🌙</button>
        </div>
        
        <div class="meta">© <span id="year"></span> • Зроблено без залежностей</div>
      </div>
    </div>
  `;
}

// Підсвічування активної сторінки
function highlightActivePage() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.nav-link, .nav-child');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // Перевіряємо чи збігається сторінка
      if (href.includes(currentPage) || 
          (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    }
  });
}

// Ініціалізація навігації
async function initNavigation() {
  const navContainer = document.getElementById('navigation');
  
  if (!navContainer) {
    console.warn('Контейнер #navigation не знайдено');
    return;
  }
  
  // Завантажуємо проєкти
  const projects = await loadProjectsData();
  
  // Генеруємо HTML
  const navHTML = generateNavHTML(projects);
  navContainer.innerHTML = navHTML;
  
  // Оновлюємо рік у футері
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Підсвічуємо активну сторінку
  highlightActivePage();
  
  // Оновлюємо стан кнопок теми
  updateThemeButtons();
}

// Запуск при завантаженні DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}
