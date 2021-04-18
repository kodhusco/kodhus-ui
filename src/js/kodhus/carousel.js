const whichTransitionEvent = () => {
  const el = document.createElement("fake");
  const transEndEventNames = {
    WebkitTransition: "webkitTransitionEnd",
    MozTransition: "transitionend",
    transition: "transitionend",
  };
  let transitionEvent = "transitionend";
  Object.keys(transEndEventNames).forEach((key) => {
    if (el.style[key] !== undefined) {
      transitionEvent = transEndEventNames[key];
    }
  });
  return transitionEvent;
};
const transEndEventName = whichTransitionEvent();

class Carousel {
  constructor(selector) {
    this.inTransition = false;
    this.slideDelay = 1000;
    this.transitionTime = 1000;
    this.autoSlide = false;
    this.numElements = 0;
    this.infinite = false;
    this.slideSenseWdith = null;
    this.autoslideInterval = null;
    if (selector) {
      this.carousel = selector;
    } else {
      this.carousel = document.querySelector(".cdt-carousel");
    }

    if (this.carousel) {
      this.numElements = this.carousel.querySelectorAll('section').length;
      this.carouselType =
        this.carousel.getAttribute("data-carousel-type") || "none";
      if (this.carousel.getAttribute("data-auto-slide") === "true") {
        this.autoSlide = true;
      } else {
        this.autoSlide = false;
      }
      this.slideDelay = this.carousel.getAttribute("data-slide-delay");
      this.transitionTime = this.carousel.getAttribute(
          "data-transition-duration"
        ) ?
        parseInt(this.carousel.getAttribute("data-transition-duration")) :
        this.transitionTime;

      if (this.carousel.getAttribute("data-infinite") === "true") {
        this.infinite = true;
      } else {
        this.infinite = false;
      }
      this.controls = this.carousel.querySelectorAll(".controls li");
      this.arrowLeft = this.carousel.querySelector(".arrow.left");
      this.arrowRight = this.carousel.querySelector(".arrow.right");
      this.sections = this.carousel.querySelectorAll("section");
      this.numElements = this.sections.length;

      this.opacityDuration =
        this.carouselType === "fade" ?
        this.carousel.getAttribute("data-opacity-duration") 
        ? this.carousel.getAttribute("data-opacity-duration") 
        : 1000  
        : 1000;

      this.carouselSlideSenseContainer = document.createElement("div");
      this.slideSenseWdith = this.numElements * 100;
      this.carouselSlideSenseContainer.style.width = `${this.slideSenseWdith}%`
      this.carouselItemContainer = document.createElement("div");

      this.selected = 0;
      this.approximateNumPages = 0;
      (this.page = 0), (this.maxPages = 0);

      if (this.arrowLeft) {
        this.arrowLeft.addEventListener(
          "click",
          () => {
            this.moveBack();
          },
          true
        );
      }
      if (this.arrowRight) {
        this.arrowRight.addEventListener("click", () => {
          this.moveForward();
        });
      }

      this.initCarousel();
      if (this.controls.length) {
        this.setArrowsVisibility(0);
      }
    }
  }

  slide() {
    if (!this.autoSlide) {
      if (this.autoslideInterval) {
        clearInterval(this.autoslideInterval);
        this.autoslideInterval = null;
      }
      return;
    }
    this.infinite = true;
    this.autoslideInterval = setInterval(() => {
      this.moveForward();
    }, this.slideDelay);
  }

  initCarousel() {
    this.resetSections();
    this.sections[this.selected].style.zIndex = 6;
    if (this.carouselType === "fade") {
      this.sections[this.selected].style.opacity = 1;
    }
    if (this.controls.length)
      this.controls[this.selected].classList.add("selected");

    this.controls.forEach((control, index) => {
      control.addEventListener("click", () => {
        if (index === this.selected) return;
        if (index > this.selected) {
          this.runCarousel(index, 'right');
        } else {
          this.runCarousel(index, 'left');
        }
        
        
      });
    });
    this.setAutoSlide();
  }
  setArrowsVisibility(index) {
    if (!this.infinite && index === this.numElements - 1) {
      this.arrowRight.classList.add('hide');
    } else {
      this.arrowRight.classList.remove('hide');
    }
    if (!this.infinite && index === 0) {
      this.arrowLeft.classList.add('hide');
    } else {
      this.arrowRight.classList.remove('hide');
    }
  }
  runCarousel(index, dir) {
    if (this.inTransition) return;

    if (this.controls.length) {
      this.setArrowsVisibility(index);
    }
    /* setting z-index of all to 0 */
    if (this.carouselType !== "slide-sense") {
      this.resetSections();
    }
    if (this.carouselType === "slide-sense") {
      this.carouselSlideSenseContainer.style.transition = `transform ${this.transitionTime}ms`;
      this.carouselSlideSenseContainer.style.transform = `translateX(${
        -index * 100 / this.numElements
      }%)`;
      this.selected = index;
    }

    if (this.carouselType === "slide") {
      this.sections[index].style.zIndex = 5;
    } else if (this.carouselType === "overlay") {
      this.sections[this.selected].style.zIndex = 7;
      this.sections[index].style.zIndex = 6;
    }

    if (this.carouselType === "overlay" || this.carouselType === "slide") {
      if (this.infinite) {
        if (
          (index > this.selected && index !== this.numElements - 1) ||
          (dir && dir === "right")
        ) {
          this.sections[this.selected].style.transform = "translateX(0%)";
          this.sections[index].style.transform = "translateX(100%)";
        } else {
          this.sections[this.selected].style.transform = "translateX(0%)";
          this.sections[index].style.transform = "translateX(-100%)";
        }
      } else if (index >= this.selected) {
        this.sections[index].style.transform = "translateX(100%)";
      } else {
        this.sections[index].style.transform = "translateX(-100%)";
      }
    }

    if (this.controls.length) {
      this.controls.forEach((control) => {
        control.classList.remove("selected");
      });
    }
    setTimeout(() => {
      this.inTransition = true;
      if (this.carouselType === "slide-sense") {
        if (this.controls.length)
          this.controls[index].classList.add("selected");
        this.carouselSlideSenseContainer.addEventListener(
          transEndEventName,
          () => {
            this.selected = index;
            this.inTransition = false;
          }
        );
      } else {
        if (this.carouselType === "fade") {
          this.sections[index].style.zIndex = 6;
          this.sections[index].style.opacity = 1;
          this.selected = index;
          this.inTransition = false;
        }

        if (this.carouselType === "overlay" || this.carouselType === "slide") {
          this.sections[index].style.transition = `transform ${this.transitionTime}ms`;
          this.sections[
            this.selected
          ].style.transition = `transform ${this.transitionTime}ms`;
          if (this.infinite) {
            if (
              (index > this.selected && index !== this.numElements - 1) ||
              (dir && dir === "right")
            ) {
              this.sections[this.selected].style.transform =
                "translateX(-100%)";
            } else {
              this.sections[this.selected].style.transform = "translateX(100%)";
            }
          } else if (index > this.selected) {
            this.sections[this.selected].style.transform = "translateX(-100%)";
          } else {
            this.sections[this.selected].style.transform = "translateX(100%)";
          }
          this.sections[index].style.transform = "translateX(0%)";
        }
        if (this.carouselType === "none") {
          this.sections.forEach((section) => (section.style.zIndex = null));
          this.resetSections();
          this.sections[index].style.zIndex = 6;
          this.selected = index;
          this.inTransition = false;
        }
        if (this.controls.length)
          this.controls[index].classList.add("selected");
        let transitionCounter = 0;
        const context = this;
        this.sections[this.selected].addEventListener(
          transEndEventName,
          function cb(e) {

            context.sections[context.selected].removeEventListener('transitionend', cb);
            window.dispatchEvent(new CustomEvent('selectedIndex', {detail: {index}}));
            console.log('this happens');
            transitionCounter += 1;
            context.sections[context.selected].style.transform = null;
            context.sections[context.selected].style.transition = null;
            context.sections[index].style.transform = null;
            context.sections[index].style.transition = null;
            if (context.carouselType === "overlay") {
              context.sections[context.selected].style.zIndex = 6;
              context.sections[index].style.zIndex = 7;
            } else if (context.carouselType === "slide") {
              context.resetSections();
              context.sections[context.selected].style.zIndex = 5;
              context.sections[index].style.zIndex = 6;
            }
            context.selected = index;
            context.inTransition = false;
            transitionCounter = 0;
          }
        );
      }
    }, 0);
  }

  resetSections() {
    if (this.carouselType === "slide-sense") {
      this.carouselSlideSenseContainer.classList.add("slideSense-container");
      this.carousel.prepend(this.carouselSlideSenseContainer);
    }
    if (this.carouselType === "slide-multi") {
      this.carousel.style.width = "100%";
      this.carouselItemContainerf.classList.add("carousel-item-container");
      this.carousel.prepend(this.carouselItemContainer);
    }
    this.sections.forEach((section, index) => {
      if (this.carouselType === "fade") {
        section.style.zIndex = 0;
        section.style.opacity = 0;
        section.style.transition = `opacity ${this.opacityDuration}ms`;
      } else if (
        this.carouselType === "overlay" ||
        this.carouselType === "slide"
      ) {
        if (index !== this.selected) {
          section.style.zIndex = 0;
        }
      } else if (this.carouselType === "slide-sense") {
        section.style.position = "relative";
        this.carouselSlideSenseContainer.appendChild(section);
      } else if (this.carouselType === "slide-multi") {
        this.carouselItemContainer.appendChild(section);
        this.approximateNumPages =
          this.carouselItemContainer.parentElement.scrollWidth /
          this.carousel.offsetWidth;
        this.maxPages = Number.isInteger(this.approximateNumPages) ?
          Math.floor(this.approximateNumPages) - 1 :
          Math.ceil(this.approximateNumPages) - 1;
      }
    });
  }

  moveForward() {
    if (this.carouselType === "slide-multi") {
      if (this.page <= this.maxPages - 1) {
        this.page++;
        this.carouselItemContainer.style.transform = `translate(-${
          this.page * this.carousel.offsetWidth
        }px)`;
      }
      return;
    }

    if (this.selected === this.numElements - 1 && !this.infinite) return;
    let index = 0;
    if (this.selected + 1 >= this.numElements) {
      if (this.infinite) {
        index = 0;
      } else {
        index = this.numElements - 1;
      }
    } else {
      index = this.selected + 1;
    }
    this.runCarousel(index, "right");
  }
  setCarouselType(carouselType) {
    this.carouselType = carouselType;
  }
  setAutoSlide() {
    this.slide();
  }
  setOpacityDuration(duration) {
    this.opacityDuration = duration;
    this.resetSections();
  }
  setInfinite(infinite) {
    this.infinite = infinite;
  }
  setSlideDelay(delay) {
    this.slideDelay = delay;
    this.resetSections();
  }
  moveBack() {
    if (this.carouselType === "slide-multi") {
      if (this.page > 0) {
        this.page--;
        this.carouselItemContainer.style.transform = `translate(-${
          this.page * this.carousel.offsetWidth
        }px)`;
      }
    }
    if (this.carouselType === "slide-multi") {
      if (this.page > 0) {
        this.page--;
        this.carouselItemContainer.style.transform = `translate(-${
          this.page * this.carousel.offsetWidth
        }px)`;
      }
    }
    if (this.selected === 0 && !this.infinite) return;
    let index = 0;
    if (this.selected - 1 < 0) {
      if (this.infinite) {
        index = this.numElements - 1;
      } else {
        index = 0;
      }
    } else {
      index = this.selected - 1;
    }
    console.log('ind', index)
    this.runCarousel(index, "left");
  }
}

export default Carousel;