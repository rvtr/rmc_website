// I've never written JS before. I still haven't.
// Sorry to anyone looking at this, I don't know how it works or if it's good practice.
var colorboxElements = document.querySelectorAll('.colorbox');
var colorClasses = ['colorbox0', 'colorbox1', 'colorbox2', 'colorbox3'];
colorboxElements.forEach(function(element) {
    element.classList.remove('colorbox');
    var randomIndex = Math.floor(Math.random() * colorClasses.length);
    var randomColorClass = colorClasses[randomIndex];
    element.classList.add(randomColorClass);
});
var elements = document.querySelectorAll('[src]');
var elementsWithInlineStyles = document.querySelectorAll("[style]");

// 1-4 are for UI images (randomized between the 4 colors)
// Other is for non-image UI elements

if (new Date().getMonth() == 5) {
  // Pride
  colorOne = 'blue';
  colorTwo = 'pink';
  colorTre = 'white';
  colorFor = 'blue';
  seasonal = true;
/* } else if (new Date().getMonth() == 10) {
  // October
  colorOne = 'black';
  colorTwo = 'white';
  colorTre = 'black';
  colorFor = 'white';
  colorOtr = 'background-color: #ffffff;border: 2px solid #c6c6c6;';
  seasonal = true; */
} else if (new Date().getMonth() == 11) {
  // Christmas
  colorOne = 'red';
  colorTwo = 'green';
  colorTre = 'red';
  colorFor = 'green';
  seasonal = true;
} else {
  var randomColor = Math.floor(Math.random() * 7) + 1;

  switch (randomColor) {
    case 1:
      colorOne = 'green';
      colorTwo = 'green';
      colorTre = 'green';
      colorFor = 'green';
      colorOtr = 'background-color: #2ec429;border: 2px solid #1e8b00;';
      seasonal = true;
      break;
    case 2:
      colorOne = 'pink';
      colorTwo = 'pink';
      colorTre = 'pink';
      colorFor = 'pink';
      colorOtr = 'background-color: #feb0fc;border: 2px solid #e488b1;';
      seasonal = true;
      break;
    case 3:
      colorOne = 'white';
      colorTwo = 'white';
      colorTre = 'white';
      colorFor = 'white';
      colorOtr = 'background-color: #ffffff;border: 2px solid #c6c6c6;';
      seasonal = true;
      break;
    case 4:
      colorOne = 'black';
      colorTwo = 'black';
      colorTre = 'black';
      colorFor = 'black';
      colorOtr = 'background-color: #393939;border: 2px solid #141414;color:white;';
      seasonal = true;
      break;
    case 5:
      colorOne = 'red';
      colorTwo = 'red';
      colorTre = 'red';
      colorFor = 'red';
      colorOtr = 'background-color: #fb1830;border: 2px solid #ba0020;color:white;';
      seasonal = true;
      break;
    case 6:
      colorOne = 'blue';
      colorTwo = 'blue';
      colorTre = 'blue';
      colorFor = 'blue';
      colorOtr = 'background-color: #62caff;border: 2px solid #3a98e1;color:black;';
      seasonal = true;
      break;
    case 7:
      colorOne = 'orange';
      colorTwo = 'orange';
      colorTre = 'orange';
      colorFor = 'orange';
      colorOtr = 'background-color: #fbd39a;border: 2px solid #fb7900;color:black;';
      seasonal = true;
      break;
  }
}

/*
  colorOne = 'green';
  colorTwo = 'green';
  colorTre = 'green';
  colorFor = 'green';
  colorOtr = 'background-color: #2ec429;border: 2px solid #1e8b00;';
  seasonal = true;
*/

// I WILL NOT OPTIMIZE THIS
// SHUT UP SHUT UP SHUT UP
if (seasonal == true) {

  elementsWithInlineStyles.forEach(function(element) {
    var inlineStyle = element.getAttribute("style");
    var newInlineStyle = inlineStyle.replace(/\/\*dummystyle\*\//g, colorOtr);
    element.setAttribute("style", newInlineStyle);
  });
  for (var i = 0; i < elements.length; i++) {
      var srcElement = elements[i];
      var src = srcElement.getAttribute('src');
      var parentOne = srcElement.closest('.colorbox0');
      var parentTwo = srcElement.closest('.colorbox1');
      var parentTre = srcElement.closest('.colorbox2');
      var parentFor = srcElement.closest('.colorbox3');
      if (parentOne) {
          if (src && src.includes('/menu/green')) {
              var newSrc = src.replace('/menu/green', `/menu/${colorOne}`);
              srcElement.setAttribute('src', newSrc);
          }
      }      
      if (parentTwo) {
          if (src && src.includes('/menu/green')) {
              var newSrc = src.replace('/menu/green', `/menu/${colorTwo}`);
              srcElement.setAttribute('src', newSrc);
          }
      }      
      if (parentTre) {
          if (src && src.includes('/menu/green')) {
              var newSrc = src.replace('/menu/green', `/menu/${colorTre}`);
              srcElement.setAttribute('src', newSrc);
          }
      }      
      if (parentFor) {
          if (src && src.includes('/menu/green')) {
              var newSrc = src.replace('/menu/green', `/menu/${colorFor}`);
              srcElement.setAttribute('src', newSrc);
          }
      }
  }
}