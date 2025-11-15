// nav.js - Генерація навігації на всіх сторінках

let projectsData = [];

// Завантаження даних проєктів
async function loadProjectsData() {
  try {
    const response = await fetch('data/projects/index.json');
    
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
      <!-- Мобільний хедер: логотип зліва + кнопка справа -->
      <div class="mobile-header">
        <a href="index.html" class="logo-link-mobile">
          <img 
            src="assets/images/logo.png" 
            alt="Логотип" 
            class="logo-image-mobile"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="logo-placeholder-mobile">
            <div class="logo-initial">О</div>
          </div>
        </a>
        <a class="btn btn-accent btn-mobile-contact" href="index.html#contact">Зв'язатися</a>
      </div>
      
      <!-- Логотип і tagline (десктоп) -->
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
        <p class="tagline">майстерня практичних ШІ-рішень</p>
      </div>
      
      <!-- Навігація -->
      <nav>
        <div class="nav-title">Навігація</div>
        <a class="nav-link" href="/portfolio/index.html">🏠 <span>Головна</span></a>
<a class="nav-link" href="/portfolio/projects.html">💡 <span>Інтерактивні крафти</span></a>
<a class="nav-link" href="/portfolio/gpts.html">🤖 <span>GPTs крафти</span></a>
<a class="nav-link" href="/portfolio/blog.html">📝 <span>Блог</span></a>
        
        <!-- Переключатель теми в меню (тільки мобільні) -->
        <div class="theme-toggle-mobile">
          <div class="nav-title">Тема</div>
          <div class="theme-buttons">
            <button class="btn theme-btn" id="lightThemeBtnMobile" title="Світла тема" 
                    onclick="setTheme('light')">☀️ Світла</button>
            <button class="btn theme-btn" id="darkThemeBtnMobile" title="Темна тема" 
                    onclick="setTheme('dark')">🌙 Темна</button>
          </div>
        </div>
      </nav>
      
      <div class="grow"></div>
      
      <!-- Футер (десктоп) -->
      <div class="cta">
        <a class="btn btn-accent" href="/portfolio/index.html#contact">Зв'язатися</a>
        
        <!-- Переключатель теми (компактний, десктоп) -->
        <div class="theme-toggle-compact">
          <button class="btn theme-btn" id="lightThemeBtn" title="Світла тема" aria-label="Світла тема" 
                  onclick="setTheme('light')">☀️</button>
          <button class="btn theme-btn" id="darkThemeBtn" title="Темна тема" aria-label="Темна тема" 
                  onclick="setTheme('dark')">🌙</button>
        </div>
        
        <div class="meta">© <span id="year"></span> • Зроблено без залежностей</div>
      </div>
      
      <!-- Рік внизу (тільки мобільні) -->
      <div class="mobile-footer">
        <div class="meta">© <span id="year-mobile"></span> • Зроблено без залежностей</div>
      </div>
    </div>
  `;
}

// Додати кнопку-перемикач для мобільних
function addMobileNavToggle() {
  if (window.innerWidth <= 860) {
    const nav = document.querySelector('nav');
    const mobileHeader = document.querySelector('.mobile-header');
    
    // Створюємо кнопку якщо її ще немає
    if (!document.querySelector('.nav-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'nav-toggle';
      toggle.innerHTML = '☰ Меню';
      toggle.onclick = () => {
        nav.classList.toggle('open');
        toggle.classList.toggle('open');
      };
      
      // Вставляємо після мобільного хедера
      mobileHeader.after(toggle);
    }
  }
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
  
  // Оновлюємо рік у футері (обидва)
  const yearElement = document.getElementById('year');
  const yearElementMobile = document.getElementById('year-mobile');
  const currentYear = new Date().getFullYear();
  
  if (yearElement) yearElement.textContent = currentYear;
  if (yearElementMobile) yearElementMobile.textContent = currentYear;
  
  // Підсвічуємо активну сторінку
  highlightActivePage();
  
  // Оновлюємо стан кнопок теми (десктоп і мобільні)
  updateThemeButtons();
  
  // Додаємо мобільну кнопку меню
  addMobileNavToggle();
  
  // При зміні розміру вікна
  window.addEventListener('resize', addMobileNavToggle);
}

// Запуск при завантаженні DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation);
} else {
  initNavigation();
}