init();

var data;


function init() {
  d3.json("static/js/samples.json").then(dataInitial => {
    data = dataInitial;
    var selectValues = dataInitial.names;

    var selectOpt = d3.select("#selDataset");

    selectValues.forEach(value => {
      selectOpt.append("option").text(value).attr("value", function() {
          return value;
        });
    });
  });
}

d3.selectAll("#selDataset").on("optionChanged", plotGraphs);

function plotGraphs() {

  var selectValue = d3.select("#selDataset").node().value;
  createBarChart(selectValue);

}

function createBarChart(selectValue) {

  var filterValue = data.samples.filter(value => value.id == selectValue);
 
  var otUids = filterValue.map(value => value.otu_ids);
  
  otUids = getOtuids(otUids[0].slice(0, 10));
 
  var otUids = filterValue.map(value => value.sample_values);
  otUids = otUids[0].slice(0, 10);

  var otuLabels = filterValue.map(value => value.otu_labels);
  var otuLabels = getBactNames(otuLabels[0]).slice(0, 10);

  // console.log(otUid);
  // console.log(xAxis);
  // console.log(out_label);
  // console.log(names);

  // Create the Trace
  var trace = {
    x: xAxis,
    y: otUids,
    text: otuLabels,
    type: "bar",
  };

  var layout = {
   };

  // Plot the chart to a div tag with id "bar-plot"
  Plotly.newPlot("bar", trace, layout);
}     

//function to return the name of the bacteria.
// if an array value has more than one name, it will consider the last name of the value
// return just the 10 first values of the result
function getBactName(names) {

  var listOfBacts = [];

  for (var i = 0; i < names.length; i++) {

    var stringName = names[i].toString();
    var splitValue = stringName.split(";");

    if (splitValue.length > 1) {
      listOfBacts.push(splitValue[splitValue.length - 1]);
    } else {
      listOfBacts.push(splitValue[0]);
    }
  }

  return listOfBacts;
}

function getOtuid(names) {

  var listOfOtuids = [];

  for (var i = 0; i < names.length; i++) {
    listOfOtuids.push(`OTU ${names[i]}`);
  }

  return listOfOtuids;
}
