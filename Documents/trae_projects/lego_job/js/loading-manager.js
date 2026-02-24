/**
 * 加载动画管理器 - 乐高风格
 * 使用ES5语法确保兼容性
 */

// 加载状态
var isLoading = false;
var loadingOverlay = null;

// 加载提示语库
var loadingMessages = [
  '正在搭建积木世界...',
  '组装创意模块中...',
  '构建精彩故事...',
  '堆砌想象力的砖块...'
];

/**
 * 初始化加载管理器
 */
function initLoadingManager() {
  createLoadingOverlay();
}

/**
 * 创建加载遮罩元素
 */
function createLoadingOverlay() {
  if (document.getElementById('global-loading-overlay')) {
    return;
  }

  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'global-loading-overlay';
  loadingOverlay.className = 'loading-overlay hidden';
  loadingOverlay.innerHTML = '' +
    '<div class="loading-container">' +
      '<div class="lego-loader">' +
        '<div class="lego-block"></div>' +
        '<div class="lego-block"></div>' +
        '<div class="lego-block"></div>' +
        '<div class="lego-block"></div>' +
        '<div class="lego-block"></div>' +
      '</div>' +
      '<div class="loading-text">' +
        '<span id="loading-message">加载中</span><span class="dots"></span>' +
      '</div>' +
      '<div class="loading-subtext" id="loading-subtext">请稍候...</div>' +
    '</div>';

  document.body.appendChild(loadingOverlay);
}

/**
 * 显示全屏加载动画
 * @param {Object} options - 配置选项
 */
function showLoading(options) {
  options = options || {};

  if (!loadingOverlay) {
    createLoadingOverlay();
  }

  var messages = loadingMessages;
  var randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // 更新文字
  var messageEl = loadingOverlay.querySelector('#loading-message');
  if (messageEl) {
    messageEl.textContent = options.message || randomMessage;
  }

  var subtextEl = loadingOverlay.querySelector('#loading-subtext');
  if (subtextEl) {
    subtextEl.textContent = options.subtext || '请稍候...';
  }

  // 显示遮罩
  loadingOverlay.classList.remove('hidden');
  isLoading = true;

  // 禁止页面滚动
  document.body.style.overflow = 'hidden';
}

/**
 * 隐藏加载动画
 */
function hideLoading() {
  if (loadingOverlay) {
    loadingOverlay.classList.add('hidden');
  }
  isLoading = false;

  // 恢复页面滚动
  document.body.style.overflow = '';
}

/**
 * 更新加载文字
 * @param {string} message - 主提示文字
 * @param {string} subtext - 副提示文字
 */
function updateLoadingText(message, subtext) {
  if (!loadingOverlay) return;

  var messageEl = loadingOverlay.querySelector('#loading-message');
  var subtextEl = loadingOverlay.querySelector('#loading-subtext');

  if (messageEl && message) {
    messageEl.textContent = message;
  }
  if (subtextEl && subtext) {
    subtextEl.textContent = subtext;
  }
}

/**
 * 设置按钮加载状态
 * @param {HTMLElement} button - 按钮元素
 * @param {boolean} loading - 是否加载中
 * @param {string} loadingText - 加载时显示的文字
 */
function setButtonLoading(button, loading, loadingText) {
  loadingText = loadingText || '';

  if (!button) return;

  if (loading) {
    button.dataset.originalText = button.textContent;
    button.classList.add('btn-loading');
    if (loadingText) {
      button.textContent = loadingText;
    }
    button.disabled = true;
  } else {
    button.classList.remove('btn-loading');
    if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
    }
    button.disabled = false;
  }
}

/**
 * 显示迷你加载器
 * @param {HTMLElement} container - 容器元素
 */
function showMiniLoader(container) {
  if (!container) return;
  container.innerHTML = '<div class="lego-loader" style="width:20px;height:20px;border-width:3px;"></div>';
}
