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
  init() {
    this.inTransition = false;

    this.carousel = document.querySelector(".cdt-carousel");
    if (this.carousel) {
      this.carouselType = this.carousel.getAttribute("data-carousel-type");
      let autoSlide = false;
      if (this.carousel.getAttribute("data-auto-slide") === "true") {
        autoSlide = true;
      } else {
        autoSlide = false;
      }
      const slideDelay = this.carousel.getAttribute("data-slide-delay");

      this.infinite = false;
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
        this.carouselType === "fade"
          ? this.carousel.getAttribute("data-opacity-duration")
          : 1000;

      this.carouselSlideSenseContainer = document.createElement("div");
      this.carouselItemContainer = document.createElement("div");

      this.selected = 0;
      this.approximateNumPages = 0;
      (this.page = 0), (this.maxPages = 0);

      const slide = () => {
        this.infinite = true;
        setInterval(() => {
          this.moveForward();
        }, slideDelay);
      };
      if (autoSlide) {
        slide();
      }
      if (this.arrowLeft) {
        this.arrowLeft.addEventListener("click", () => {
          this.moveBack();
        });
      }
      if (this.arrowRight) {
        this.arrowRight.addEventListener("click", () => {
          this.moveForward();
        });
      }

      this.initCarousel();
    }
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
        this.runCarousel(index);
      });
    });
  }

  runCarousel(index, dir) {
    if (this.inTransition) return;
    if (!this.infinite && index === this.numElements - 1) {
      this.arrowRight.style.display = "none";
    } else {
      this.arrowRight.style.display = "block";
    }
    if (!this.infinite && index === 0) {
      this.arrowLeft.style.display = "none";
    } else {
      this.arrowLeft.style.display = "block";
    }
    /* setting z-index of all to 0 */
    if (this.carouselType !== "slide-sense") {
      this.resetSections();
    }
    if (this.carouselType === "slide-sense") {
      this.carouselSlideSenseContainer.style.transition = "transform 1s";
      this.carouselSlideSenseContainer.style.transform = `translateX(${
        -index * 25
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
          this.sections[index].style.transform = "translateX(100%)";
        } else {
          this.sections[index].style.transform = "translateX(-100%)";
        }
      } else if (index > this.selected) {
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
        this.sections[this.selected].style.transition = "transform 1s";
        if (this.carouselType === "fade") {
          this.sections[index].style.zIndex = 6;
          this.sections[index].style.opacity = 1;
          this.selected = index;
          this.inTransition = false;
        }
        if (this.carouselType === "slide") {
          this.sections[index].style.transition = "transform 1s";
        }

        if (this.carouselType === "overlay" || this.carouselType === "slide") {
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
          this.sections[index].style.transform = "translateX(0)";
          this.sections[index].style.transform = "translateX(0)";
        }
        if (this.controls.length)
          this.controls[index].classList.add("selected");
        let transitionCounter = 0;
        this.sections[this.selected].addEventListener(
          transEndEventName,
          (e) => {
            transitionCounter += 1;
            if (transitionCounter === 1 && e.propertyName === "transform") {
              this.sections[this.selected].style.transform = "";
              this.sections[this.selected].style.transition = "";
              this.sections[index].style.transform = "";
              this.sections[index].style.transition = "";
              if (this.carouselType === "overlay") {
                this.sections[this.selected].style.zIndex = 6;
                this.sections[index].style.zIndex = 7;
              } else if (this.carouselType === "slide") {
                this.resetSections();
                this.sections[this.selected].style.zIndex = 5;
                this.sections[index].style.zIndex = 6;
              }
              this.selected = index;
              this.inTransition = false;
            }
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
      this.carouselItemContainer.classList.add("carousel-item-container");
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
        this.maxPages = Number.isInteger(this.approximateNumPages)
          ? Math.floor(this.approximateNumPages) - 1
          : Math.ceil(this.approximateNumPages) - 1;
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
    this.runCarousel(index, "left");
  }
}

export default Carousel;
