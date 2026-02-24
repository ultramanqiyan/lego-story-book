(function() {
  var ThemeManager = {
    themes: {
      default: {
        name: '经典乐高',
        nameEn: 'Classic LEGO',
        description: '经典乐高风格，活力童趣',
        icon: '🧱',
        cssFile: null
      },
      immersive: {
        name: '沉浸故事',
        nameEn: 'Immersive Story',
        description: '古典故事书风格，沉浸式体验',
        icon: '📖',
        cssFile: 'css/theme-immersive.css'
      },
      gamified: {
        name: '游戏冒险',
        nameEn: 'Gamified Adventure',
        description: '游戏化界面，等级成就系统',
        icon: '🎮',
        cssFile: 'css/theme-gamified.css'
      }
    },
    
    currentTheme: 'default',
    themeStyleElement: null,
    
    init: function() {
      this.loadTheme();
      this.createThemeStyleElement();
      this.applyTheme(this.currentTheme);
    },
    
    loadTheme: function() {
      var savedTheme = localStorage.getItem('lego-story-theme');
      if (savedTheme && this.themes[savedTheme]) {
        this.currentTheme = savedTheme;
      }
    },
    
    saveTheme: function(theme) {
      localStorage.setItem('lego-story-theme', theme);
    },
    
    createThemeStyleElement: function() {
      this.themeStyleElement = document.getElementById('theme-stylesheet');
      if (!this.themeStyleElement) {
        this.themeStyleElement = document.createElement('link');
        this.themeStyleElement.id = 'theme-stylesheet';
        this.themeStyleElement.rel = 'stylesheet';
        document.head.appendChild(this.themeStyleElement);
      }
    },
    
    applyTheme: function(theme) {
      if (!this.themes[theme]) {
        console.warn('Theme not found:', theme);
        return;
      }
      
      this.currentTheme = theme;
      this.saveTheme(theme);
      
      document.documentElement.setAttribute('data-theme', theme);
      
      var themeData = this.themes[theme];
      if (themeData.cssFile) {
        this.themeStyleElement.href = themeData.cssFile;
        this.themeStyleElement.disabled = false;
      } else {
        this.themeStyleElement.disabled = true;
      }
      
      this.updateThemeIndicator();
      
      document.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: theme, themeData: themeData } 
      }));
    },
    
    updateThemeIndicator: function() {
      var indicators = document.querySelectorAll('.theme-indicator');
      var themeData = this.themes[this.currentTheme];
      indicators.forEach(function(indicator) {
        indicator.textContent = themeData.icon + ' ' + themeData.name;
      });
    },
    
    getTheme: function() {
      return this.currentTheme;
    },
    
    getThemeData: function(theme) {
      return this.themes[theme || this.currentTheme];
    },
    
    getAllThemes: function() {
      return Object.keys(this.themes).map(function(key) {
        return Object.assign({}, { id: key }, this.themes[key]);
      }.bind(this));
    },
    
    showThemeSelector: function() {
      var modal = document.getElementById('themeSelectorModal');
      if (modal) {
        modal.style.display = 'flex';
      } else {
        this.createThemeSelectorModal();
      }
    },
    
    hideThemeSelector: function() {
      var modal = document.getElementById('themeSelectorModal');
      if (modal) {
        modal.style.display = 'none';
      }
    },
    
    createThemeSelectorModal: function() {
      var modal = document.createElement('div');
      modal.id = 'themeSelectorModal';
      modal.className = 'theme-modal';
      modal.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 10000; align-items: center; justify-content: center; backdrop-filter: blur(5px);';
      
      var themes = this.getAllThemes();
      var currentTheme = this.currentTheme;
      
      var content = document.createElement('div');
      content.className = 'theme-modal-content';
      content.style.cssText = 'background: white; border-radius: 24px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: modalSlideIn 0.4s ease;';
      
      var title = document.createElement('h3');
      title.style.cssText = 'margin: 0 0 20px; font-size: 1.5rem; text-align: center; color: #006CB7;';
      title.textContent = '🎨 选择主题风格';
      content.appendChild(title);
      
      var themeList = document.createElement('div');
      themeList.style.cssText = 'display: grid; gap: 15px;';
      
      themes.forEach(function(theme) {
        var themeCard = document.createElement('div');
        themeCard.className = 'theme-option-card';
        themeCard.style.cssText = 'padding: 20px; border-radius: 16px; border: 3px solid ' + (theme.id === currentTheme ? '#FFD500' : '#E0E0E0') + '; cursor: pointer; transition: all 0.3s ease; background: ' + (theme.id === currentTheme ? '#FFF8E7' : 'white') + ';';
        
        themeCard.innerHTML = 
          '<div style="display: flex; align-items: center; gap: 15px;">' +
            '<span style="font-size: 2.5rem;">' + theme.icon + '</span>' +
            '<div style="flex: 1;">' +
              '<div style="font-size: 1.2rem; font-weight: bold; color: #1A1A2E;">' + theme.name + '</div>' +
              '<div style="font-size: 0.9rem; color: #666; margin-top: 4px;">' + theme.description + '</div>' +
            '</div>' +
            (theme.id === currentTheme ? '<span style="color: #00A651; font-size: 1.5rem;">✓</span>' : '') +
          '</div>';
        
        themeCard.addEventListener('click', function() {
          this.applyTheme(theme.id);
          this.hideThemeSelector();
          this.showToast('主题已切换为：' + theme.name, 'success');
        }.bind(this));
        
        themeCard.addEventListener('mouseenter', function() {
          if (theme.id !== currentTheme) {
            themeCard.style.borderColor = '#006CB7';
            themeCard.style.transform = 'translateY(-2px)';
          }
        });
        
        themeCard.addEventListener('mouseleave', function() {
          if (theme.id !== currentTheme) {
            themeCard.style.borderColor = '#E0E0E0';
            themeCard.style.transform = 'none';
          }
        });
        
        themeList.appendChild(themeCard);
      }.bind(this));
      
      content.appendChild(themeList);
      
      var closeBtn = document.createElement('button');
      closeBtn.style.cssText = 'margin-top: 20px; width: 100%; padding: 12px; border: none; border-radius: 12px; background: #E0E0E0; font-size: 1rem; cursor: pointer; transition: background 0.3s;';
      closeBtn.textContent = '关闭';
      closeBtn.addEventListener('click', function() {
        this.hideThemeSelector();
      }.bind(this));
      closeBtn.addEventListener('mouseenter', function() {
        closeBtn.style.background = '#D0D0D0';
      });
      closeBtn.addEventListener('mouseleave', function() {
        closeBtn.style.background = '#E0E0E0';
      });
      content.appendChild(closeBtn);
      
      modal.appendChild(content);
      document.body.appendChild(modal);
      
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          this.hideThemeSelector();
        }
      }.bind(this));
    },
    
    showToast: function(message, type) {
      if (typeof window.showToast === 'function') {
        window.showToast(message, type);
      } else {
        var toast = document.createElement('div');
        toast.className = 'toast ' + (type || 'info');
        toast.style.cssText = 'position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); padding: 15px 30px; border-radius: 50px; color: white; font-weight: bold; z-index: 10001; animation: toastSlideUp 0.4s ease;';
        
        if (type === 'success') {
          toast.style.background = 'linear-gradient(135deg, #00A651, #00C853)';
        } else if (type === 'error') {
          toast.style.background = 'linear-gradient(135deg, #E3000F, #FF5252)';
        } else {
          toast.style.background = 'linear-gradient(135deg, #006CB7, #448AFF)';
        }
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(function() {
          toast.style.opacity = '0';
          toast.style.transition = 'opacity 0.3s ease';
          setTimeout(function() {
            toast.remove();
          }, 300);
        }, 2000);
      }
    },
    
    addThemeToggleButton: function(container) {
      if (!container) {
        container = document.querySelector('.nav') || document.querySelector('header');
      }
      
      if (!container) return;
      
      var existingBtn = document.getElementById('themeToggleBtn');
      if (existingBtn) return;
      
      var btn = document.createElement('button');
      btn.id = 'themeToggleBtn';
      btn.className = 'theme-toggle-btn';
      btn.style.cssText = 'background: rgba(255,255,255,0.2); border: 2px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 8px 16px; cursor: pointer; font-size: 0.9rem; transition: all 0.3s ease; color: inherit; font-family: inherit;';
      
      var themeData = this.themes[this.currentTheme];
      btn.innerHTML = '<span class="theme-indicator">' + themeData.icon + ' ' + themeData.name + '</span>';
      
      btn.addEventListener('click', function() {
        this.showThemeSelector();
      }.bind(this));
      
      btn.addEventListener('mouseenter', function() {
        btn.style.background = 'rgba(255,255,255,0.3)';
        btn.style.transform = 'translateY(-2px)';
      });
      
      btn.addEventListener('mouseleave', function() {
        btn.style.background = 'rgba(255,255,255,0.2)';
        btn.style.transform = 'none';
      });
      
      container.appendChild(btn);
    }
  };
  
  window.ThemeManager = ThemeManager;
  
  document.addEventListener('DOMContentLoaded', function() {
    ThemeManager.init();
    
    setTimeout(function() {
      ThemeManager.addThemeToggleButton();
    }, 100);
  });
  
  var style = document.createElement('style');
  style.textContent = '@keyframes modalSlideIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } } @keyframes toastSlideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }';
  document.head.appendChild(style);
})();
