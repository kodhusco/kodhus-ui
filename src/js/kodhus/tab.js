const TabAll = (() => {
  let selectedIndex = 0;
  const tabs = document.querySelectorAll(".cdt-tab");
  tabs.forEach((tab) => {
    if (!tab.classList.contains("no-js")) {
      tab
        .querySelector("ul")
        .querySelectorAll("li")
        .forEach((item, index) => {
          if (item.classList.contains("selected")) {
            selectedIndex = index;
            tab
              .querySelector(".tabs-content")
              .children[selectedIndex].classList.add("show");
          }
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            selectedIndex = index;
            tab.children[0]
              .querySelectorAll("li")
              .forEach((it) => it.classList.remove("selected"));
            Array.from(tab.querySelector(".tabs-content").children).forEach(
              (child, i) => {
                if (i === selectedIndex) {
                  child.classList.add("show");
                } else {
                  child.classList.remove("show");
                }
              }
            );
            item.classList.add("selected");
          });
        });
    } else {
      tab
        .querySelector("ul")
        .querySelectorAll("li")
        .forEach((item, index) => {
          if (item.classList.contains("selected")) {
            selectedIndex = index;
            tab
              .querySelector(".tabs-content")
              .children[selectedIndex].classList.add("show");
          }
        });
    }
  });
})();

class Tab {
  constructor(selector) {
    if (selector) {
      this.selector = selector;
      this.initialize(selector);
    }
  }

  removeTab(index) {
    const numTabs = this.selector.querySelector(".tabs ul").children.length;
    if (numTabs === 1) {
      throw Error("There should be one tab");
    }
    const tabToRemove = this.selector.querySelector(".tabs ul").children[index];
    tabToRemove.remove();
    this.selector.querySelector(".tabs-content").children[index].remove();
    if (numTabs > 0) {
      if (tabToRemove.classList.contains("selected")) {
        this.selector
          .querySelector(".tabs ul")
          .children[index].classList.add("selected");
        this.selector
          .querySelector(".tabs-content")
          .children[index].classList.add("show");
      }
    }

    this.initialize(this.selector);
  }
  addTab() {
    const numTabs = this.selector.querySelector(".tabs ul").children.length;
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.innerHTML = `Tab ${numTabs + 1}`;
    a.href = "#";
    li.appendChild(a);
    this.selector.querySelector(".tabs ul").appendChild(li);
    const div = document.createElement("div");
    div.innerHTML = `Tab content for tab ${numTabs + 1}`;
    this.selector.querySelector(".tabs-content").appendChild(div);
    this.initialize(this.selector);
    return numTabs;
  }
  initialize(selector) {
    if (!selector.classList.contains("no-js")) {
      selector.querySelectorAll(".tabs ul li").forEach((item, index) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          e.preventDefault();
          selector.children[0] // remove all selected from tab
            .querySelectorAll("li")
            .forEach((it) => it.classList.remove("selected"));
          item.classList.add("selected");
          Array.from(selector.querySelector(".tabs-content").children).forEach(
            (child, i) => {
              if (i === index) {
                child.classList.add("show");
              } else {
                child.classList.remove("show");
              }
            }
          );
        });
      });
    } else {
      selector
        .querySelector("ul")
        .querySelectorAll("li")
        .forEach((item, index) => {
          if (item.classList.contains("selected")) {
            // selectedIndex = index;
            tab
              .querySelector(".tabs-content")
              .children[selectedIndex].classList.add("show");
          }
        });
    }
  }
}

export default Tab;
