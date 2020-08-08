function Moveit(el, options) {
  this.el = el;
  this.length = this.getLength();
  this.setupPath(options);
}
Moveit.prototype.getLength = function () {
  if (this.el.nodeName) {
    var tagName = this.el.nodeName.toLowerCase(),
      d;
    if (tagName === "path") {
      d = this.el.getTotalLength();
    } else if (tagName === "circle") {
      d = 2 * Math.PI * parseFloat(this.el.getAttribute("r"));
    } else if (tagName === "rect") {
      d =
        2 * this.el.getAttribute("width") + 2 * this.el.getAttribute("height");
    } else if (tagName === "line") {
      var x1 = this.el.getAttribute("x1");
      var x2 = this.el.getAttribute("x2");
      var y1 = this.el.getAttribute("y1");
      var y2 = this.el.getAttribute("y2");
      d = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    return d;
  }
};
Moveit.prototype.setupPath = function (options) {
  let { start, end, opacity } = options;
  //this.el.style.strokeOpacity = opacity;
  start = this.getValue(start);
  end = this.getValue(end);
  var dash = end - start;
  var gap = 100 - (end - start);
  var offset = 100 - start;
  this.el.style.strokeDasharray =
    (dash / 100) * this.length + " " + (gap / 100) * this.length;
  this.el.style.strokeDashoffset = (offset / 100) * this.length;
};
Moveit.prototype.setPosition = function (options) {
  if (this.el.style) {
    var visibility = options.visibility !== undefined ? options.visibility : 1;
    if (visibility === 0) {
      this.el.style.visibility = "hidden";
    } else if (visibility === 1) {
      this.el.style.visibility = "visible";
    } else {
      this.el.style.visibility = "visible";
    }
    this.setupPath(options);
  }
};
Moveit.prototype.anim = function (options) {
  if (this.el.style) {
    this.el.getBoundingClientRect();
    var opacity = options.opacity !== undefined ? options.opacity : 1;
    var visibility = options.visibility !== undefined ? options.visibility : 1;
    if (visibility === 0) {
      this.el.style.visibility = "hidden";
    } else if (visibility === 1) {
      this.el.style.visibility = "visible";
    } else {
      this.el.style.visibility = "visible";
    }
    var delay = options.delay ? options.delay : 0;
    var timing = options.timing ? options.timing : "linear";
    this.el.style.transition = this.el.style.WebkitTransition = "none";

    this.el.style.transition = this.el.style.WebkitTransition =
      "stroke-dashoffset " +
      options.duration +
      "s " +
      timing +
      ", stroke-dasharray " +
      options.duration +
      "s " +
      timing;

    this.el.addEventListener(
      "transitionend",
      function (e) {
        if (options.callback || options.follow) {
          if (
            e.propertyName === "stroke-dashoffset" ||
            e.propertyName === "stroke-dasharray"
          ) {
            if (options.follow) {
              this.el.style.transition = this.el.style.WebkitTransition =
                "none";
              this.setupPath({
                start: -(100 - this.getValue(options.start)),
                end: this.getValue(options.end) - 100,
              });
              delete options.follow;
            }
            if (options.callback) {
              setTimeout(function () {
                options.callback && options.callback();
                delete options.callback;
              }, 0);
            }
          }
        }
      }.bind(this)
    );
    setTimeout(
      function () {
        this.setupPath(options);
      }.bind(this),
      delay * 1000
    );
  }
};
Moveit.prototype.getValue = function (val) {
  if (val.toString().indexOf("%") === -1) {
    return val;
  }
  return parseFloat(val.substring(0, val.indexOf("%")));
};
Moveit.prototype.set = function (options) {
  if (options.duration === "undefined") {
    this.setupPath(options);
    return;
  }
  this.anim(options);
};
