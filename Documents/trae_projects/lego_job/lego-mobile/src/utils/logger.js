const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CONFIG = {
  enabled: true,
  minLevel: LOG_LEVELS.DEBUG,
  showTimestamp: true,
  showCategory: true,
  persistErrors: true,
};

const formatTimestamp = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
};

const formatMessage = (category, message, data) => {
  const parts = [];
  
  if (CONFIG.showTimestamp) {
    parts.push(`[${formatTimestamp()}]`);
  }
  
  if (CONFIG.showCategory && category) {
    parts.push(`[${category}]`);
  }
  
  parts.push(message);
  
  return parts.join(' ');
};

const log = (level, category, message, data = null) => {
  if (!CONFIG.enabled || level < CONFIG.minLevel) {
    return;
  }

  const formattedMessage = formatMessage(category, message, data);
  
  switch (level) {
    case LOG_LEVELS.DEBUG:
      if (data !== null) {
        console.log(formattedMessage, data);
      } else {
        console.log(formattedMessage);
      }
      break;
    case LOG_LEVELS.INFO:
      if (data !== null) {
        console.info(formattedMessage, data);
      } else {
        console.info(formattedMessage);
      }
      break;
    case LOG_LEVELS.WARN:
      if (data !== null) {
        console.warn(formattedMessage, data);
      } else {
        console.warn(formattedMessage);
      }
      break;
    case LOG_LEVELS.ERROR:
      if (data !== null) {
        console.error(formattedMessage, data);
      } else {
        console.error(formattedMessage);
      }
      break;
  }
};

const logger = {
  debug: (category, message, data = null) => log(LOG_LEVELS.DEBUG, category, message, data),
  info: (category, message, data = null) => log(LOG_LEVELS.INFO, category, message, data),
  warn: (category, message, data = null) => log(LOG_LEVELS.WARN, category, message, data),
  error: (category, message, data = null) => log(LOG_LEVELS.ERROR, category, message, data),
  
  api: {
    request: (method, endpoint, params = null) => {
      logger.debug('API', `>>> ${method} ${endpoint}`, params);
    },
    response: (method, endpoint, data) => {
      const preview = typeof data === 'object' 
        ? JSON.stringify(data).substring(0, 200) + (JSON.stringify(data).length > 200 ? '...' : '')
        : data;
      logger.debug('API', `<<< ${method} ${endpoint}`, preview);
    },
    error: (method, endpoint, error) => {
      logger.error('API', `!!! ${method} ${endpoint} FAILED`, error?.message || error);
    },
    cacheHit: (endpoint) => {
      logger.debug('API', `CACHE HIT: ${endpoint}`);
    },
    cacheMiss: (endpoint) => {
      logger.debug('API', `CACHE MISS: ${endpoint}`);
    },
  },
  
  nav: {
    navigate: (from, to, params = null) => {
      logger.info('NAV', `${from} -> ${to}`, params);
    },
    tabChange: (tabName) => {
      logger.info('NAV', `Tab changed to: ${tabName}`);
    },
    back: (from) => {
      logger.info('NAV', `Back from: ${from}`);
    },
  },
  
  screen: {
    mount: (screenName, params = null) => {
      logger.info('SCREEN', `Mount: ${screenName}`, params);
    },
    unmount: (screenName) => {
      logger.debug('SCREEN', `Unmount: ${screenName}`);
    },
    focus: (screenName) => {
      logger.debug('SCREEN', `Focus: ${screenName}`);
    },
    blur: (screenName) => {
      logger.debug('SCREEN', `Blur: ${screenName}`);
    },
    action: (screenName, action, data = null) => {
      logger.info('SCREEN', `${screenName}: ${action}`, data);
    },
    error: (screenName, action, error) => {
      logger.error('SCREEN', `${screenName}: ${action} FAILED`, error?.message || error);
    },
  },
  
  auth: {
    loginStart: (username) => {
      logger.info('AUTH', `Login start: ${username}`);
    },
    loginSuccess: (userId, username) => {
      logger.info('AUTH', `Login success: ${username} (${userId})`);
    },
    loginError: (error) => {
      logger.error('AUTH', 'Login failed', error?.message || error);
    },
    logout: () => {
      logger.info('AUTH', 'Logout');
    },
    checkAuth: (result) => {
      logger.debug('AUTH', `Auth check: ${result ? 'authenticated' : 'not authenticated'}`);
    },
    sessionRestore: (userId, username) => {
      logger.info('AUTH', `Session restored: ${username} (${userId})`);
    },
  },
  
  theme: {
    change: (from, to) => {
      logger.info('THEME', `Theme changed: ${from} -> ${to}`);
    },
    load: (themeId) => {
      logger.debug('THEME', `Loaded theme: ${themeId}`);
    },
    styleChange: (type, from, to) => {
      logger.info('THEME', `${type} style changed: ${from} -> ${to}`);
    },
  },
  
  context: {
    update: (contextName, field, value) => {
      logger.debug('CONTEXT', `${contextName}: ${field} =`, value);
    },
    init: (contextName) => {
      logger.debug('CONTEXT', `${contextName} initialized`);
    },
  },
  
  storage: {
    get: (key, value) => {
      logger.debug('STORAGE', `GET ${key}`, value !== null && value !== undefined ? 'found' : 'not found');
    },
    set: (key) => {
      logger.debug('STORAGE', `SET ${key}`);
    },
    remove: (key) => {
      logger.debug('STORAGE', `REMOVE ${key}`);
    },
    clear: () => {
      logger.info('STORAGE', 'CLEAR ALL');
    },
  },
  
  component: {
    mount: (componentName, props = null) => {
      logger.debug('COMP', `Mount: ${componentName}`, props);
    },
    unmount: (componentName) => {
      logger.debug('COMP', `Unmount: ${componentName}`);
    },
    action: (componentName, action, data = null) => {
      logger.debug('COMP', `${componentName}: ${action}`, data);
    },
    error: (componentName, error) => {
      logger.error('COMP', `${componentName} ERROR`, error?.message || error);
    },
  },
  
  data: {
    fetch: (source, params = null) => {
      logger.debug('DATA', `Fetching from ${source}`, params);
    },
    fetchSuccess: (source, count = null) => {
      logger.debug('DATA', `Fetched from ${source}${count !== null ? ` (${count} items)` : ''}`);
    },
    fetchError: (source, error) => {
      logger.error('DATA', `Fetch failed from ${source}`, error?.message || error);
    },
    create: (type, data) => {
      logger.info('DATA', `Creating ${type}`, data);
    },
    createSuccess: (type, id) => {
      logger.info('DATA', `Created ${type} with id: ${id}`);
    },
    update: (type, id, data) => {
      logger.info('DATA', `Updating ${type} ${id}`, data);
    },
    delete: (type, id) => {
      logger.info('DATA', `Deleting ${type} ${id}`);
    },
  },
  
  animation: {
    start: (name) => {
      logger.debug('ANIM', `Start: ${name}`);
    },
    complete: (name) => {
      logger.debug('ANIM', `Complete: ${name}`);
    },
  },
};

export { LOG_LEVELS, CONFIG };
export default logger;
