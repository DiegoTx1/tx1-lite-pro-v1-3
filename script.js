document.addEventListener("DOMContentLoaded", function() {
    const comando = document.getElementById("comando").querySelector("span");
    setTimeout(() => {
        comando.innerText = "CALL";
        comando.style.color = "lime";
    }, 3000);
});