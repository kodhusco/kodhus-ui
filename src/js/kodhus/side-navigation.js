const SideNavigation = (() => {
  const openers = document.querySelectorAll(".cdt-side-nav .opener");
  openers.forEach(function (opener) {
    let closed = true;
    opener.addEventListener("click", () => {
      const subItems = opener.parentElement.parentElement.nextElementSibling;
      if (closed) {
        subItems.classList.remove("hide");
        opener;
      } else {
        subItems.classList.add("hide");
      }
      closed = !closed;
    });
  });
})();

export default SideNavigation;
