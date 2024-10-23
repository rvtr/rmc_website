var colorboxElements = document.querySelectorAll('.colorbox');
var colorClasses = ['colorbox0', 'colorbox1', 'colorbox2', 'colorbox3'];
colorboxElements.forEach(function(element) {
    element.classList.remove('colorbox');
    var randomIndex = Math.floor(Math.random() * colorClasses.length);
    var randomColorClass = colorClasses[randomIndex];
    element.classList.add(randomColorClass);
});
var elements = document.querySelectorAll('[src]');
if (new Date().getMonth() == 5) {
  // Pride
  colorOne = 'blue';
  colorTwo = 'pink';
  colorTre = 'white';
  colorFor = 'blue';
  seasonal = false;
} else if (new Date().getMonth() == 9) {
  // October
  colorOne = 'black';
  colorTwo = 'white';
  colorTre = 'black';
  colorFor = 'white';
  seasonal = false;
} else if (new Date().getMonth() == 11) {
  // Christmas
  colorOne = 'red';
  colorTwo = 'green';
  colorTre = 'red';
  colorFor = 'green';
  seasonal = false;
} 

colorOne = 'pink';
colorTwo = 'pink';
colorTre = 'pink';
colorFor = 'pink';
seasonal = true;

// I WILL NOT OPTIMIZE THIS
// SHUT UP SHUT UP SHUT UP
if (seasonal == true) {

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