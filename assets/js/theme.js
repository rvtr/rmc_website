// cyrb53 from https://github.com/bryc/code. This code is in the public domain.
const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// The code below randomly assigns 1 of 4 identical color box classes to elements that have the plain colorbox class.
// This allows them to be assigned a random color from the seasonal themes that use more than one color.
let colorboxElements = document.querySelectorAll('.colorbox');
let colorClasses = ['colorbox0', 'colorbox1', 'colorbox2', 'colorbox3'];
colorboxElements.forEach(function(element) {
    element.classList.remove('colorbox');
    let randomIndex = Math.floor(Math.random() * colorClasses.length);
    console.log(randomIndex);
    let randomColorClass = colorClasses[randomIndex];
    element.classList.add(randomColorClass);
});

// Use seasonal themes if the current month is a seasonal month.
if (new Date().getMonth() === 5) {
    // Pride
    css = "background-color: #62caff;border: 2px solid #3a98e1;color:black;";
    colors = ["blue", "pink", "white", "pink"];
/* } else if (new Date().getMonth() == 10) {
  // October
  css = 'background-color: #ffffff;border: 2px solid #c6c6c6;';
  colors = ["black", "white", "black", "white"]; */
} else if (new Date().getMonth() === 11) {
    // Christmas
    css = "background-color: #2ec429;border: 2px solid #1e8b00;";
    colors = ["red", "green", "red", "green",]
} else {
    // This code gets the current year/month/day as a string and hashes it to generate a random number. This means that
    // a different theme color will be used every day, and navigating around the site won't result in the color changing
    // while still allowing for some randomness.
    let date = new Date();
    const dateSeed = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let randomColor = (cyrb53(dateSeed) % colorClasses.length) + 1;
    switch (randomColor) {
        case 1:
            css = "background-color: #2ec429;border: 2px solid #1e8b00;";
            colors = ["green"];
            break;
        case 2:
            css = "background-color: #feb0fc;border: 2px solid #e488b1;";
            colors = ["pink"];
            break;
        case 3:
            css = "background-color: #ffffff;border: 2px solid #c6c6c6;";
            colors = [ "white"];
            break;
        case 4:
            css = "background-color: #393939;border: 2px solid #141414;color:white;";
            colors = ["black"];
            break;
        case 5:
            css = "background-color: #fb1830;border: 2px solid #ba0020;color:white;";
            colors = ["red"];
            break;
        case 6:
            css = "background-color: #62caff;border: 2px solid #3a98e1;color:black;";
            colors = ["blue"];
            break;
        case 7:
            css = "background-color: #fbd39a;border: 2px solid #fb7900;color:black;";
            colors = ["orange"];
            break;
    }
}

// I have no idea what this comment block is, so I'm leaving it. - Campbell
/*
  colorOne = 'green';
  colorTwo = 'green';
  colorTre = 'green';
  colorFor = 'green';
  colorOtr = 'background-color: #2ec429;border: 2px solid #1e8b00;';
  seasonal = true;
*/

// Get the elements we're going to set the colors of, and then iterate over the 4 colorbox classes and assign the
// correct colors to them.
let elements = document.querySelectorAll('[src]');
let elementsWithInlineStyles = document.querySelectorAll("[style]");
elementsWithInlineStyles.forEach(function(element) {
    let inlineStyle = element.getAttribute("style");
    let newInlineStyle = inlineStyle.replace(/\/\*dummystyle\*\//g, css);
    element.setAttribute("style", newInlineStyle);
});
for (let i = 0; i < elements.length; i++) {
    let srcElement = elements[i];
    let src = srcElement.getAttribute('src');
    for (let i = 0; i < 4; i++) {
        if (srcElement.closest('.colorbox' + i)) {
            if (src && src.includes('/menu/green')) {
                let newSrc;
                // If there's only 1 color in the current theme, use that for each class. Otherwise, use the correct
                // color for the iterator we're on.
                if (colors.length === 1) {
                    newSrc = src.replace('/menu/green', `/menu/${colors[0]}`);
                } else {
                    newSrc = src.replace('/menu/green', `/menu/${colors[i]}`);
                }
                srcElement.setAttribute('src', newSrc);
            }
        }
    }
}
