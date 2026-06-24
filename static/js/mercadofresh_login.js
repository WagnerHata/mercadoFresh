const passwordToggle = document.querySelector(".password-toggle");
const passwordInput = document.getElementById("senha");

passwordToggle?.addEventListener("click", () => {
  const icon = passwordToggle.querySelector(".ti");
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  passwordToggle.classList.toggle("is-visible", isHidden);
  passwordToggle.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
  icon?.classList.toggle("ti-eye", !isHidden);
  icon?.classList.toggle("ti-eye-off", isHidden);
});
