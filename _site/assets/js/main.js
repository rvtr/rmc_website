window.addEventListener('load', setFooterDate, false);

function setFooterDate() {
    let footerDate = document.getElementById("footerDate");
    footerDate.textContent = new Date().getFullYear().toString();
}