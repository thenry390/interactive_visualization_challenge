// first time, call to initialize page populating drop-down list
init();
var data;

function init() {

  d3.json("static/js/samples.json").then(dataInit => {

    data = dataInit;

    var selectValues = dataInit.names;

    var selectOpt = d3.select("#selDataset");

    selectValues.forEach(value => {
      selectOpt.append("option").text(value).attr("value", function() {
          return value;
        });
    });

    plotGraphs('940')

  });
}

function plotGraphs(selectValue) {

  createBarChart(selectValue);
  bubbleChart(selectValue);

}

function createBarChart(selectValue) {
  // grab the samples based upon ID selected from drop-down
  var filterValue = data.samples.filter(value => value.id == selectValue);
  // for the samples, grab the OTU IDs
  var otuIds = filterValue.map(value => value.otu_ids);
  // call function getOtuids passing the first 10 values to get the list of 10 OTU IDs
  otuIds = getOtuids(otuIds[0].slice(0, 10)).reverse();
  // grab the sample values from samples
  var samples = filterValue.map(value => value.sample_values);
  // grab the first 10 OTU IDs
  sampleCounts = samples[0].slice(0, 10).reverse();
  // grab the OTU Labels from the samples
  var otuLabels = filterValue.map(value => value.otu_labels);
  // call function getBackNames passing the first 10 OTU Labels to get the list of 10 bacteria names
 
  var otuLabels = (otuLabels[0]).slice(0, 10).reverse();

  var trace = {

    // x axis
    x: sampleCounts,
    // Y axis
    y: otuIds,
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

function bubbleChart(valueSelect) {
  var filterValue3 = data.samples.filter(value => value.id == valueSelect);
  var otuId = filterValue3.map(value => value.otu_ids);
  otuId = otuId[0];
  var sampValues = filterValue3.map(v => v.sample_values);
  sampValues = sampValues[0];

  var outLabel = filterValue3.map(v => v.otu_labels);
  outLabel = getBactNames(outLabel[0]);

  var trace = {
    x: otuId,
    y: sampValues,
    mode: "markers",
    marker: {
      color: otuId,
      size: sampValues
    },
    text: outLabel
  };

  var layout = {
      xaxis: { title: "OTU ID" }
  };

  Plotly.newPlot("bubble", [trace], layout);
}
// function to return the name of the bacteria.
// if an array value has more than one name, it will consider the last name of the value
// return just the 10 first values of the result
function getBactNames(names) {

  var listOfBacts = [];

  for (var i = 0; i < names.length; i++) {

    var stringName = names[i].toString();
    var splitValue = stringName.split(";");

    if (splitValue.length = 1) {
      listOfBacts.push(splitValue[0]);
    } 
    else {
      listOfBacts.push(splitValue[splitValue.length - 1]);
    }
  }

  return listOfBacts;
}

function getOtuids(names) {

  var listOfOtuids = [];

  for (var i = 0; i < names.length; i++) {
    listOfOtuids.push(`OTU ${names[i]}`);
  }

  return listOfOtuids;
}
