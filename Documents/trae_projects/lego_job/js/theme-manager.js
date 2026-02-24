/**
 * 主题管理器 - 处理4种不同风格的切换
 * 风格：乐高积木、梦幻童话、科幻未来、自然森林
 * 使用ES5语法确保兼容性
 */

// 主题配置
var THEMES = {
  lego: {
    name: '乐高积木',
    cssClass: 'theme-lego',
    bgElements: ['lego-bg'],
    colors: ['#e53935', '#ffd600', '#1e88e5', '#43a047']
  },
  fairy: {
    name: '梦幻童话',
    cssClass: 'theme-fairy',
    bgElements: ['fairy-bg'],
    colors: ['#ffb7c5', '#d4a5ff', '#a8d8ff']
  },
  scifi: {
    name: '科幻未来',
    cssClass: 'theme-scifi',
    bgElements: ['scifi-bg', 'scifi-scanlines'],
    colors: ['#00f5ff', '#0080ff', '#bf00ff']
  },
  nature: {
    name: '自然森林',
    cssClass: 'theme-nature',
    bgElements: ['nature-bg', 'nature-forest', 'nature-sunlight'],
    colors: ['#2d5016', '#7cb342', '#8bc34a']
  }
};

// 当前主题
var currentTheme = localStorage.getItem('selectedTheme') || '';

/**
 * 初始化主题
 */
function initTheme() {
  var savedTheme = localStorage.getItem('selectedTheme');
  if (savedTheme && THEMES[savedTheme]) {
    applyTheme(savedTheme);
  }
}

/**
 * 应用主题
 * @param {string} themeName - 主题名称 (lego/fairy/scifi/nature)
 */
function applyTheme(themeName) {
  if (!THEMES[themeName]) {
    console.warn('Unknown theme:', themeName);
    return;
  }

  // 移除所有主题类
  Object.keys(THEMES).forEach(function(key) {
    document.body.classList.remove(THEMES[key].cssClass);
  });

  // 隐藏所有背景元素
  document.querySelectorAll('.theme-bg').forEach(function(el) {
    el.style.display = 'none';
  });

  // 禁用所有主题CSS
  Object.keys(THEMES).forEach(function(key) {
    var cssLink = document.getElementById('theme-' + key + '-css');
    if (cssLink) {
      cssLink.disabled = true;
    }
  });

  // 应用新主题
  var theme = THEMES[themeName];
  document.body.classList.add(theme.cssClass);

  // 启用对应CSS
  var cssLink = document.getElementById('theme-' + themeName + '-css');
  if (cssLink) {
    cssLink.disabled = false;
  }

  // 显示对应背景元素
  theme.bgElements.forEach(function(bgId) {
    var bgEl = document.getElementById(bgId);
    if (bgEl) {
      bgEl.style.display = 'block';
    }
  });

  // 生成背景元素内容
  generateThemeElements(themeName);

  // 更新当前主题
  currentTheme = themeName;
  localStorage.setItem('selectedTheme', themeName);

  // 触发自定义事件
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));

  console.log('Theme applied: ' + theme.name);
}

/**
 * 生成主题特定的背景元素
 * @param {string} themeName - 主题名称
 */
function generateThemeElements(themeName) {
  switch (themeName) {
    case 'fairy':
      generateFairyStars();
      generateFairyClouds();
      generateFairyPetals();
      break;
    case 'scifi':
      generateSciFiBinary();
      break;
    case 'nature':
      generateNatureLeaves();
      generateNatureButterflies();
      break;
  }
}

/**
 * 生成童话风格的星星
 */
function generateFairyStars() {
  var container = document.getElementById('fairy-bg');
  if (!container || container.children.length > 0) return;

  for (var i = 0; i < 50; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    star.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(star);
  }
}

/**
 * 生成童话风格的云朵
 */
function generateFairyClouds() {
  var container = document.getElementById('fairy-bg');
  if (!container) return;

  for (var i = 1; i <= 3; i++) {
    var cloud = document.createElement('div');
    cloud.className = 'cloud cloud' + i;
    container.appendChild(cloud);
  }
}

/**
 * 生成童话风格的花瓣
 */
function generateFairyPetals() {
  var container = document.getElementById('fairy-bg');
  if (!container) return;

  for (var i = 0; i < 20; i++) {
    var petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * 100 + '%';
    petal.style.animationDelay = Math.random() * 10 + 's';
    petal.style.animationDuration = (8 + Math.random() * 4) + 's';
    container.appendChild(petal);
  }
}

/**
 * 生成科幻风格的二进制背景
 */
function generateSciFiBinary() {
  var container = document.querySelector('.binary-bg');
  if (!container) {
    var binaryBg = document.createElement('div');
    binaryBg.className = 'binary-bg';
    document.body.appendChild(binaryBg);
  }

  var binaryEl = document.querySelector('.binary-bg');
  if (binaryEl && binaryEl.textContent === '') {
    var binaryText = '';
    for (var i = 0; i < 500; i++) {
      binaryText += Math.random() > 0.5 ? '1' : '0';
      if (i % 50 === 0) binaryText += '\n';
    }
    binaryEl.textContent = binaryText;
  }
}

/**
 * 生成自然风格的树叶
 */
function generateNatureLeaves() {
  var container = document.getElementById('nature-bg');
  if (!container || container.children.length > 0) return;

  for (var i = 0; i < 10; i++) {
    var leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.style.left = (10 + i * 10) + '%';
    leaf.style.animationDelay = (i * 0.5) + 's';
    leaf.style.animationDuration = (7 + Math.random() * 3) + 's';
    container.appendChild(leaf);
  }
}

/**
 * 生成自然风格的蝴蝶
 */
function generateNatureButterflies() {
  var container = document.getElementById('nature-bg');
  if (!container) return;

  for (var i = 0; i < 3; i++) {
    var butterfly = document.createElement('div');
    butterfly.className = 'butterfly';
    butterfly.textContent = '🦋';
    butterfly.style.left = (20 + i * 30) + '%';
    butterfly.style.top = (20 + i * 20) + '%';
    butterfly.style.animationDelay = (i * 2) + 's';
    container.appendChild(butterfly);
  }
}

/**
 * 获取当前主题
 * @returns {string} 当前主题名称
 */
function getCurrentTheme() {
  return currentTheme;
}

/**
 * 切换主题
 * @param {string} themeName - 主题名称
 */
function toggleTheme(themeName) {
  if (currentTheme === themeName) {
    resetTheme();
  } else {
    applyTheme(themeName);
  }
}

/**
 * 重置为默认主题
 */
function resetTheme() {
  Object.keys(THEMES).forEach(function(key) {
    document.body.classList.remove(THEMES[key].cssClass);
  });

  document.querySelectorAll('.theme-bg').forEach(function(el) {
    el.style.display = 'none';
  });

  Object.keys(THEMES).forEach(function(key) {
    var cssLink = document.getElementById('theme-' + key + '-css');
    if (cssLink) {
      cssLink.disabled = true;
    }
  });

  var legoBg = document.getElementById('lego-bg');
  if (legoBg) {
    legoBg.style.display = 'block';
  }

  currentTheme = '';
  localStorage.removeItem('selectedTheme');

  console.log('Theme reset to default');
}

/**
 * 预加载主题CSS
 */
function preloadThemes() {
  Object.keys(THEMES).forEach(function(themeName) {
    var link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = 'css/theme-' + themeName + '.css';
    document.head.appendChild(link);
  });
}
