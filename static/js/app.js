// double up of code, how do I just make it listen for a change rather than writing the code twice
// change variable names and tidy up code

// Using the D3 library to read in samples.json.
d3.json("samples.json").then(function(data){ 
    console.log(data);
}); 

// Creating the drop down with each subject id number as an option/row
function dropdown() {
    var subjectSelect = d3.select("#selDataset")
    d3.json("samples.json").then((data => {
        var names = data.names; // pulling out the names
        names.forEach((sample) => {
            // this appends the rows in html with option tag .e.g. <option>940</option>
            subjectSelect.append("option").text(sample).property("value", sample)
        })
    }))
};
dropdown()

// Creating an initial function so that when the webpage is opened 940's visualisations are displayed
function init() {
    d3.json("samples.json").then(function(data) {
        // DEMOGRAPHICS:
        var initialDemographics = data.metadata[0];
        // then appending it to the demographic info panel
        var select = d3.select("#sample-metadata");
        Object.entries(initialDemographics).forEach(([key,value]) =>{
            select
              .append('p').text(`${key} : ${value}`)
            });

        // EXTRACTING DATA FOR ID 940:
        var sample = data.samples[0];
        var idNumber = sample.id;
        
        var sampleValues = sample.sample_values;
        console.log(`Sample values for ${idNumber}: ${sampleValues}`);
        var otuIds = sample.otu_ids;
        console.log(`OTU ids for ${idNumber}: ${otuIds}`);
        var labels = sample.otu_labels;
        console.log(`OTU labels for ${idNumber}: ${labels}`);

        // BAR CHART - TOP 10 VALUES:

        // Sorting the array of sample values in descending order
        var sampleValuesSorted = Array.from(sampleValues).sort((a, b) => b-a);
        // Slicing the first 10 objects for plotting
        var sampleValuesSliced = sampleValuesSorted.slice(0, 10);
        // Reverse the array to accommodate Plotly's defaults
        var sampleValuesReversed = sampleValuesSliced.reverse();

        // Doing the same for y axis labels
        var otuIdsSliced = otuIds.slice(0, 10);
        var otuIdsReversed = otuIdsSliced.reverse();
        // OTU id's are currently integers which changes the way they are plotted on the y axis
        // Using map to create a new array with OTU added as a string infront of each ID 
        var otuIdLabels = otuIdsReversed.map(y => "OTU " + y);
        
        // Doing the same for the hover text
        var labelsSliced = labels.slice(0, 10);
        var labelsReversed = labelsSliced.reverse();

        // PLOTTING BAR CHART:
        var trace1 = {
            type: "bar",
            x: sampleValuesReversed,
            y: otuIdLabels,
            text: labelsReversed, 
            orientation: 'h'
        }

        var data = [trace1];

        var layout = {
            title: `Top 10 OTU's for ID No.${idNumber}`,
            margin: {
                l: 100,
                r: 100,
                b: 100,
                t: 100
            }
        } 

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data, layout);

        
        // PLOTTING BUBBLE GRAPH - already created variables for values
        var trace2 = {
            x: otuIds, 
            y: sampleValues, 
            text: labels,
            mode: 'markers',
            marker: {
              size: sampleValues,
              color: otuIds
            }
          };
          
          var dataTwo = [trace2];
          
          var layout = {
            title: `All OTU's for ID No.${idNumber}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            showlegend: false,
            height: 600,
            width: 1000
          };
          
          // Render the plot to the div tag with id "bubble"
          Plotly.newPlot('bubble', dataTwo, layout);


          // WASHING FREQUENCY GAUGE CHART
          d3.json("samples.json").then(function(data) { 
            var initialGauge = data.metadata[0];
            var initialWashFrequency = initialGauge.wfreq;
            console.log(`Washing frequency for ${idNumber}: ${initialWashFrequency}`);
    
            // pLOTTING GAUGE
            var dataThree = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: initialWashFrequency,
                    title: { text: `ID ${idNumber} Scrubs Per Week`},
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 9 ]},
                        steps: [
                            { range: [0, 1], color: "White"},
                            { range: [1, 2], color: "Beige"},
                            { range: [2, 3], color: "Wheat"},
                            { range: [3, 4], color: "Tan"},
                            { range: [4, 5], color: "LightGreen"},
                            { range: [5, 6], color: "YellowGreen"},
                            { range: [6, 7], color: "SeaGreen"},
                            { range: [7, 8], color: "ForestGreen"},
                            { range: [8, 9], color: "Green"}
                        ],   
                    }    
                }
            ];
            
            var layout = { width: 600, height: 500, margin: { t: 50, b: 50 } };
            
            // Render the plot to the div tag with id "gauge"
            Plotly.newPlot('gauge', dataThree, layout);
    
        });
    });
}
init() 


// creating a function to handle change in dropdown menu
// Recoded all of the above plots
// Need to find another solution

function optionChanged(subject_id) {
    d3.json("samples.json").then(function(data) { 
        var samples = data.samples;
        var filteredSamples = samples.filter(x => x.id == subject_id);
        // to remove an error message that I was receiving when calling sample_values
        if(filteredSamples[0] == undefined){
            return;
        };
        var valuesBarChart = filteredSamples[0].sample_values;
        console.log(`Sample values for ${subject_id}: ${valuesBarChart}`);
        var labelsBarChart = samples.filter(x => x.id == subject_id)[0].otu_ids;
        console.log(`OTU ids for selected subject id: ${labelsBarChart}`);
        var labelsHoverText = samples.filter(x => x.id == subject_id)[0].otu_labels;
        console.log(`OTU labels for selected subject id: ${labelsHoverText}`);

        // Sorting the array of sample values in descending order
        // Don't particularly need this step as the array is already sorted in descending order
        var valuesBarChartSorted = Array.from(valuesBarChart).sort((a, b) => b-a);
        console.log(`Sorted sample values for selected subject id: ${valuesBarChartSorted}`);

        // Slicing the first 10 objects for plotting
        var valuesBarChartSliced = valuesBarChartSorted.slice(0, 10);
        console.log(`Top 10 sample values for selected subject id: ${valuesBarChartSliced}`);

        // Reverse the array to accommodate Plotly's defaults
        var valuesBarChartReversed = valuesBarChartSliced.reverse();
        console.log(`Top 10 sample values reversed: ${valuesBarChartReversed}`);

        
        // DOING THE SAME FOR Y AXIS LABELS
        // Slicing the first 10 labels for plotting
        var labelsBarChartSliced = labelsBarChart.slice(0, 10);
        console.log(`Top 10 id's for selected subject id: ${labelsBarChartSliced}`);

        // Reverse the array to accommodate Plotly's defaults
        var labelsBarChartReversed = labelsBarChartSliced.reverse();
        console.log(`Top 10 id's reversed: ${labelsBarChartReversed}`);

        // OTU id's are currently integers which changes the way they are plotted on the y axis
        // Using map to create a new array with OTU added as a string infront of each ID 
        // should I be using parse int
        var labels = labelsBarChartReversed.map(y => "OTU " + y);
        console.log(`Top 10 OTU IDs in correct format for labels y axis: ${labels}`);

        
        // DOING THE SAME FOR HOVER TEXT
        // Slicing the first 10 hover text for plotting
        var labelsHoverTextSliced = labelsHoverText.slice(0, 10);
        console.log(`Top 10 OTU labels for hover text: ${labelsHoverTextSliced}`);

        // Reverse the array to accommodate Plotly's defaults
        var labelsHoverTextReversed = labelsHoverTextSliced.reverse();
        console.log(`Top 10 OTU labels reversed: ${labelsHoverTextReversed}`);


        // Plotting horizontal bar chart
        var trace1 = {
            type: "bar",
            x: valuesBarChartReversed,
            y: labels,
            text: labelsHoverTextReversed, 
            orientation: 'h'
        }

        var data = [trace1];
        
        var layout = {
            title: `Top 10 OTU's for ID No.${subject_id}`,
            margin: {
                l: 100,
                r: 100,
                b: 100,
                t: 100
            }
        } 

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data, layout);



        // 3. Create a bubble chart that displays each sample.
        // Use otu_ids for the x values.
        // Use sample_values for the y values.
        // Use sample_values for the marker size.
        // Use otu_ids for the marker colors.
        // Use otu_labels for the text values.

        // https://plotly.com/javascript/bubble-charts/
        var trace2 = {
            x: labelsBarChart,
            y: valuesBarChart,
            text: labelsHoverText,
            mode: 'markers',
            marker: {
              size: valuesBarChart,
              color: labelsBarChart // red colour gradient by default, would be able to change
            }
          };
          
          var dataTwo = [trace2];
          
          var layout = {
            title: `All OTU's for ID No.${subject_id}`,
            xaxis: {
                title: "OTU ID"
            },
            yaxis: {
                title: "Sample Values"
            },
            showlegend: false,
            height: 600,
            width: 1000
          };
          
          // Render the plot to the div tag with id "bubble"
          Plotly.newPlot('bubble', dataTwo, layout);



    // 4. Display the sample metadata, i.e., an individual's demographic information.
    // 5. Display each key-value pair from the metadata JSON object somewhere on the page.

    // defining a function to pull out demographic info, depending on subject_id
    function demographicInfo() {
        d3.json("samples.json").then(function(data) { 
            var metadata = data.metadata;
            var filteredMeta = metadata.filter(x => x.id == subject_id);
            
            // then appending it to the demographic info panel
            var select = d3.select("#sample-metadata"); 
            // .html("") to clear any existing metadata, if it is not present then more rows appended every time you click on an id number
            select.html("");
            // `Object.entries` to add each key and value pair to the panel
            // p is new row in panel, add text from key value pairs
            Object.entries(filteredMeta[0]).forEach(([key,value]) =>{
            select
              .append('p').text(`${key} : ${value}`)
            });

        });
    };
    demographicInfo()


    // Advanced Challenge Assignment (Optional)
    // Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ to plot the weekly washing frequency of the individual.
    // You will need to modify the example gauge code to account for values ranging from 0 through 9.
    // Update the chart whenever a new sample is selected.

    // pulling out the washing frequency for selected ID No
    d3.json("samples.json").then(function(data) { 
        var metaData = data.metadata;
        var washFrequency = metaData.filter(x => x.id == subject_id)[0].wfreq;
        console.log(`Washing frequency for ${subject_id}: ${washFrequency}`);


        var dataThree = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: washFrequency,
                title: { text: "Scrubs Per Week" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9 ]},
                    steps: [
                        { range: [0, 1], color: "White"},
                        { range: [1, 2], color: "Beige"},
                        { range: [2, 3], color: "Wheat"},
                        { range: [3, 4], color: "Tan"},
                        { range: [4, 5], color: "LightGreen"},
                        { range: [5, 6], color: "YellowGreen"},
                        { range: [6, 7], color: "SeaGreen"},
                        { range: [7, 8], color: "ForestGreen"},
                        { range: [8, 9], color: "Green"}
                    ],
                    

                    
                }
                
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 50, b: 50 } };
        
        Plotly.newPlot('gauge', dataThree, layout);



    });


    });
};


optionChanged()
