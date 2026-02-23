/**
 * 乐高故事书 - 动画初始化脚本
 * 处理滚动触发动画和交互效果
 */

(function() {
  'use strict';

  // 等待DOM加载完成
  document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initMagneticButtons();
    initRippleEffect();
    initParallaxEffect();
  });

  /**
   * 初始化滚动触发动画
   */
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale');

    if (animatedElements.length === 0) return;

    // 创建Intersection Observer
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          // 添加延迟以创建错开效果
          var delay = entry.target.dataset.delay || 0;
          setTimeout(function() {
            entry.target.classList.add('animate');
          }, delay * 1000);

          // 可选：只触发一次动画
          // observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // 观察所有需要动画的元素
    animatedElements.forEach(function(el, index) {
      // 为每个元素添加递增的延迟
      el.dataset.delay = index * 0.1;
      observer.observe(el);
    });
  }

  /**
   * 初始化磁性按钮效果
   */
  function initMagneticButtons() {
    var magneticButtons = document.querySelectorAll('.magnetic-btn');

    if (window.matchMedia('(pointer: coarse)').matches) {
      // 触摸设备禁用磁性效果
      return;
    }

    magneticButtons.forEach(function(btn) {
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
      });

      btn.addEventListener('mouseleave', function() {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /**
   * 初始化按钮波纹效果
   */
  function initRippleEffect() {
    var buttons = document.querySelectorAll('.btn-ripple');

    buttons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        var ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        btn.appendChild(ripple);

        setTimeout(function() {
          ripple.remove();
        }, 600);
      });
    });
  }

  /**
   * 初始化视差滚动效果
   */
  function initParallaxEffect() {
    var particles = document.querySelector('.particles-container');

    if (!particles || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    var ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          var scrolled = window.pageYOffset;
          particles.style.transform = 'translateY(' + (scrolled * 0.5) + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * 添加成功动画
   * @param {HTMLElement} element - 要添加动画的元素
   */
  window.addSuccessAnimation = function(element) {
    element.classList.add('success-animation');
    setTimeout(function() {
      element.classList.remove('success-animation');
    }, 1000);
  };

  /**
   * 添加错误动画
   * @param {HTMLElement} element - 要添加动画的元素
   */
  window.addErrorAnimation = function(element) {
    element.classList.add('error-animation');
    setTimeout(function() {
      element.classList.remove('error-animation');
    }, 500);
  };

  /**
   * 添加抖动动画
   * @param {HTMLElement} element - 要添加动画的元素
   */
  window.addShakeAnimation = function(element) {
    element.classList.add('shake-animation');
    setTimeout(function() {
      element.classList.remove('shake-animation');
    }, 500);
  };

})();
