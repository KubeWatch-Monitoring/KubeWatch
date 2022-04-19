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

const collapseBtn = document.querySelector(".btn-collapse-all");
const collapsableElements = collapseBtn.parentElement.querySelectorAll(".collapsable");

collapseBtn.addEventListener("click", () => {
    collapsableElements.forEach((e) => {
        if (!e) {
            throw new ReferenceError("Could not find collapsable");
        }
        e.hidden = !e.hidden;
    })
});