const API_BASE = '/api';

async function fetchAPI(endpoint, options) {
  options = options || {};
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };

  if (mergedOptions.body && typeof mergedOptions.body === 'object') {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }

  try {
    const url = `${API_BASE}${endpoint}`;
    console.log('API Request:', url, mergedOptions.method || 'GET');

    const response = await fetch(url, mergedOptions);
    console.log('API Response status:', response.status);

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error('服务器返回格式错误');
    }

    if (!response.ok) {
      throw new Error(data.error || data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error.message === 'Failed to fetch') {
      throw new Error('网络连接失败，请检查网络');
    }
    throw error;
  }
}

function showToast(message, type) {
  type = type || 'info';
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'toast ' + type;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function showModal(content) {
  const modal = document.createElement('div');
  modal.className = 'modal active';
  modal.innerHTML = 
    '<div class="modal-content">' +
      '<div class="modal-header">' +
        '<button class="modal-close">&times;</button>' +
      '</div>' +
      '<div class="modal-body">' + content + '</div>' +
    '</div>';
  
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  document.body.appendChild(modal);
  return modal;
}

function hideModal() {
  const modal = document.querySelector('.modal.active');
  if (modal) {
    modal.remove();
  }
}

function showLoading() {
  return '<div class="loading"><div class="spinner"></div></div>';
}

function getUserId() {
  return localStorage.getItem('userId') || null;
}

function setUserId(userId) {
  localStorage.setItem('userId', userId);
}

function clearUserId() {
  localStorage.removeItem('userId');
}

function requireAuth() {
  const userId = getUserId();
  if (!userId) {
    window.location.href = '/login.html';
    return null;
  }
  return userId;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function truncateText(text, maxLength) {
  maxLength = maxLength || 50;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function updateProgress(current, total) {
  const percentage = Math.round((current / total) * 100);
  const progressFill = document.querySelector('.progress-fill');
  if (progressFill) {
    progressFill.style.width = percentage + '%';
  }
  return percentage;
}

function formatTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return hours + '小时' + mins + '分钟';
  }
  return mins + '分钟';
}

window.fetchAPI = fetchAPI;
window.showToast = showToast;
window.showModal = showModal;
window.hideModal = hideModal;
window.showLoading = showLoading;
window.getUserId = getUserId;
window.setUserId = setUserId;
window.clearUserId = clearUserId;
window.requireAuth = requireAuth;
window.formatDate = formatDate;
window.truncateText = truncateText;
window.getQueryParam = getQueryParam;
window.updateProgress = updateProgress;
window.formatTime = formatTime;
