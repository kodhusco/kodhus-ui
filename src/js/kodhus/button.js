const Button = (() => {
  document.querySelectorAll(".cdt-btn.with-loader").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.add("active");
    });
  });
})();

export default Button;
