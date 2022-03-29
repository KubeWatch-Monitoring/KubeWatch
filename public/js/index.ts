document.querySelectorAll(".btn-collapse").forEach((e) => {
  e.addEventListener("click", () => {
    if (e.parentElement) {
      const view = e.parentElement.querySelector<HTMLElement>(".collapsable");
      if (!view) {
        throw new ReferenceError("Could not find collapsable");
      }
      view.hidden = !view.hidden;
    }
  });
});
