class Autocomplete {
  constructor(elSelector) {
    this.element = document.querySelector(elSelector);
    this.output = [];
    this.init();
    this.callback = undefined;
  }
  setInputData(data) {
    this.data = data;
  }
  setSearchPlaceholder(placeholder) {
    this.autoCompleteInput.setAttribute("placeholder", placeholder);
  }
  json(path) {
    return fetch(path).then((response) => {
      this.data = response.json();
      return this.data;
    });
  }
  init() {
    this.autoCompleteInput = this.element.querySelector("input");
    const suggestions = this.element.querySelector(".suggestions");
    let prevSearchTerm = "";
    let currentIndex = -1;
    suggestions.classList.add("hide");
    const resetSelectedSuggestion = () => {
      for (let i = 0; i < suggestions.children.length; i++) {
        suggestions.children[i].classList.remove("selected");
      }
    };

    function isLetter(str) {
      return str.length === 1 && str.match(/[a-z]/i);
    }

    this.autoCompleteInput.addEventListener("keyup", (e) => {
      const input = this.autoCompleteInput.value;
      console.log(prevSearchTerm, input);
      if (input !== prevSearchTerm) {
        currentIndex = -1;
      }
      if (input.length < 3) {
        prevSearchTerm = "";
        suggestions.classList.add("hide");
        return;
      }
      if (e.key === "Enter") {
        if (currentIndex !== -1) {
          location.href = this.output[currentIndex].url;
        }
        return;
        this.autoCompleteInput.value = "";
        resetSelectedSuggestion();
        clearSuggestions();
        this.callback(this.output);
        return;
      }

      if (e.key === "ArrowUp") {
        resetSelectedSuggestion();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : 0;
        suggestions.children[currentIndex].classList.add("selected");
        return;
      }

      if (e.key === "ArrowDown") {
        resetSelectedSuggestion();
        currentIndex =
          currentIndex < suggestions.children.length - 1
            ? currentIndex + 1
            : suggestions.children.length - 1;
        suggestions.children[currentIndex].classList.add("selected");
        return;
      }
      clearSuggestions();
      if (isLetter(e.key)) {
        prevSearchTerm = input;
      }
      this.output.length = 0;
      if (this.autoCompleteInput.value === "") {
        suggestions.classList.add("hide");
        return;
      }
      const searchTerm = new RegExp(input, "i");
      this.data.forEach((item) => {
        suggestions.classList.remove("hide");
        if (item.name.search(searchTerm) != -1) {
          this.output.push(item);
          createItem(item);
        }
      });
    });
    const clearSuggestions = () => {
      while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
      }
    };

    const createItem = (item) => {
      const foundItem = document.createElement("div");
      foundItem.classList.add("item");
      const link = document.createElement("a");
      link.href = item.url;
      foundItem.appendChild(link);
      const title = document.createElement("div");
      title.classList.add("title");
      title.innerHTML = item.name;
      const type = document.createElement("div");
      type.classList.add("type");
      const badge = document.createElement("div");
      badge.classList.add("cdt-badge");
      badge.innerHTML = item.type;
      type.appendChild(badge);
      link.appendChild(title);
      link.appendChild(type);
      suggestions.appendChild(foundItem);
    };
  }
  result(callback) {
    this.callback = callback;
  }
}

export default Autocomplete;
