registerSketch('sk5', function (p) {
  const vizUrl =
    "https://us-east-1.online.tableau.com/t/info474-autumn25/views/taiwan_earthquakes_viz/Dashboard1?:showVizHome=n&:embed=y&:toolbar=bottom&:tabs=n";

  p.setup = function () {
    // p.createCanvas(p.windowWidth, p.windowHeight); 

    const container = p.createDiv('');
    container.id('tableau-container');
    container.style('width', '1000px');
    container.style('height', '840px');
    container.style('margin', '0 auto');
    container.parent(document.querySelector('#sketch-container-sk5')); 

    loadTableauViz(container.elt);
  };

  function loadTableauViz(containerElement) {
    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://us-east-1.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.head.appendChild(script);

    script.onload = () => {
      const tableauViz = document.createElement('tableau-viz');
      tableauViz.id = 'taiwan-viz';
      tableauViz.src = vizUrl;
      tableauViz.width = '100%';
      tableauViz.height = '840';
      tableauViz.setAttribute('toolbar', 'bottom');
      tableauViz.setAttribute('hide-tabs', '');
      containerElement.appendChild(tableauViz);

      tableauViz.addEventListener('firstinteractive', async () => {
        const workbook = tableauViz.workbook;
      });
    };
  }

  p.draw = function () {
  };

  // p.windowResized = function () {
  //   p.resizeCanvas(p.windowWidth, p.windowHeight);
  // };
});
