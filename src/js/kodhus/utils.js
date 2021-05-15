const Utils = (() => {
  const tabletPhoneBreakpoint = 768;
  const desktopBreakPoint = 1024;
  Math.easeOutQuad = function (t, b, c, d) {
    t /= d;
    return -c * t * (t - 2) + b;
  };
  Math.easeInQuad = function (t, b, c, d) {
    t /= d;
    return c * t * t + b;
  };
  Math.easeInCubic = function (t, b, c, d) {
    t /= d;
    return c * t * t * t + b;
  };
  Math.easeOutCubic = function (t, b, c, d) {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  };
  Math.easeInOutCubic = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t + b;
    t -= 2;
    return c / 2 * (t * t * t + 2) + b;
  };
  Math.easeInQuart = function (t, b, c, d) {
    t /= d;
    return c * t * t * t * t + b;
  };
  Math.easeOutQuart = function (t, b, c, d) {
    t /= d;
    t--;
    return -c * (t * t * t * t - 1) + b;
  };
  Math.easeInOutQuart = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t * t * t + b;
    t -= 2;
    return -c / 2 * (t * t * t * t - 2) + b;
  };
  Math.linearTween = function (t, b, c, d) {
    return c * t / d + b;
  };

  Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
  };
  const scrollTo = (position, duration, callback) => {
    const start = window.scrollTop || document.documentElement.scrollTop;
    let currentT = null;
    const scroll = function (t) {
      if (!currentT) currentT = t;
      let progress = (t - currentT < duration) ? t - currentT : duration;
      const value = Math.easeInOutCubic(progress, start, position, duration);
      window.scrollTo(0, value);
      if (progress < duration) {
        window.requestAnimationFrame(scroll);
      } else {
        callback && callback();
      }
    }
    window.requestAnimationFrame(scroll);
  };
  const cssSupports = function (property, value) {
    if ('CSS' in window) {
      return CSS.supports(property, value);
    } else {
      var jsProperty = property.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      return jsProperty in document.body.style;
    }
  };

  return {
    tabletPhoneBreakpoint,
    desktopBreakPoint,
    scrollTo,
    cssSupports,
  };
})();

export default Utils;