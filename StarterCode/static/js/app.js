// first time, call to initialize page populating drop-down list
init();
var data;  // global variable declaration since this attribute is used throughout script

function init() {

  // initialize the page using d3 library loading the data from the JSON file creating the dashboard.  
  // onchange is coded inline in the index.html file

  d3.json("static/js/samples.json").then(dataInit => {

    data = dataInit;

    var selectValues = dataInit.names;

    var selectOpt = d3.select("#selDataset");

    selectValues.forEach(value => {
      selectOpt.append("option").text(value).attr("value", function() {
          return value;
        });
    });

    //default to 940 upon entry the first time
    plotGraphs('940')

  });
}
// as selection changes make calls to respective functions to rebuild dashboard
function plotGraphs(selectValue) {

  createBarChart(selectValue);
  createBubbleChart(selectValue);
  createGuageChart(selectValue);
  populateDemographicInfo(selectValue);

}

function createBarChart(selectValue) {
  // grab the samples based upon ID selected from drop-down
  var filterValue = data.samples.filter(value => value.id == selectValue);
  // for the samples, grab the OTU IDs
  var otuIds = filterValue.map(value => value.otu_ids);
  // call function getOtuids passing the first 10 values to get the list of 10 OTU IDs
  //otuIds = getOtuids(otuIds[0].slice(0, 10)).reverse();
  var names = otuIds[0].slice(0, 10);
  var listOfOtuids = [];

  for (var i = 0; i < names.length; i++) {
    listOfOtuids.push(`OTU ${names[i]}`);
  }
  listOfOtuids.reverse();

  // grab the sample values from samples
  var samples = filterValue.map(value => value.sample_values);
  // grab the first 10 OTU IDs
  sampleCounts = samples[0].slice(0, 10).reverse();
  // grab the OTU Labels from the samples
  var otuLabels = filterValue.map(value => value.otu_labels);
  
  var otuLabels = (otuLabels[0]).slice(0, 10).reverse();

  var trace = {

    // x axis
    x: sampleCounts,
    // Y axis
    y: listOfOtuids,
    // hover text
    //text: otuLabels,
    type: "bar",
    orientation: 'h',
    text: otuLabels
  };

  var layout = {

   };

  // Plot the chart to a div tag with id "bar-plot"
  Plotly.newPlot("bar", [trace], layout);
}     

function createBubbleChart(valueSelect) {

  var filterValue3 = data.samples.filter(value => value.id == valueSelect);
  var otuId = filterValue3.map(value => value.otu_ids);
  otuId = otuId[0];

  var sampValues = filterValue3.map(value => value.sample_values);
  sampValues = sampValues[0];

  var outLabel = filterValue3.map(value => value.otu_labels);
  
  var listOfBacts = [];

  for (var i = 0; i < outLabel[0].length; i++) {

    var stringName = outLabel.toString();
    var splitValue = stringName.split(";");

    if (splitValue.length = 1) {
      listOfBacts.push(splitValue[0]);
    } 
    else {
      listOfBacts.push(splitValue[splitValue.length - 1]);
    }
  }

  var trace = {
    x: otuId,
    y: sampValues,
    mode: "markers",
    marker: {
      color: otuId,
      size: sampValues
    },
    text: listOfBacts
  };

  var layout = {
      xaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bubble", [trace], layout);
}


function createGuageChart(valueSelect) {

  var filterValue = data.metadata.filter(value => value.id == valueSelect);
  var weeklyFreq = filterValue[0].wfreq;
  // basically a borrowed code snippet from borrowed from https://plotly.com/javascript/gauge-charts/
  var model = [
    {
      type: "indicator",
      mode: "gauge+number+delta",
      value: weeklyFreq,
      title: { text: "Wash Frequency", font: { size: 24 } },
      delta: { reference: 10, increasing: { color: "RebeccaPurple" } },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        // alternate colors just to show changes
        steps: [
          { range: [0, 1], color: "cyan" },
          { range: [1, 2], color: "royalblue" },
          { range: [2, 3], color: "cyan" },
          { range: [3, 4], color: "royalblue" },
          { range: [4, 5], color: "cyan" },
          { range: [5, 6], color: "royalblue" },
          { range: [6, 7], color: "cyan" },
          { range: [7, 8], color: "royalblue" },
          { range: [8, 9], color: "cyan" },
          { range: [9, 10], color: "royalblue" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: weeklyFreq
        }
      }
    }
    ];
  
  var layout = {
    width: 500,
    height: 400,
    margin: { t: 25, r: 25, l: 25, b: 25 },
    paper_bgcolor: "lavender",
    font: { color: "darkblue", family: "Arial" }
  };
  
  Plotly.newPlot('gauge', model, layout);
}

function populateDemographicInfo(valueSelect) {

  var filterValue = data.metadata.filter(value => value.id == valueSelect);

  var nValue = d3.select(".panel-body");
  nValue.html("");  //initialize otherwise will keep accumulating as selection changes
  // using paragraph seperators, add the metadata as described in homework instructions
  nValue.append("p").text(`id: ${filterValue[0].id}`);
  nValue.append("p").text(`ethnicity: ${filterValue[0].ethnicity}`);
  nValue.append("p").text(`gender: ${filterValue[0].gender}`);
  nValue.append("p").text(`age: ${filterValue[0].age}`);
  nValue.append("p").text(`location: ${filterValue[0].location}`);
  nValue.append("p").text(`bbtype: ${filterValue[0].bbtype}`);
  nValue.append("p").text(`wfreq: ${filterValue[0].wfreq}`);
}