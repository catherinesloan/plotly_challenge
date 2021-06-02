
// Using the D3 library to read in samples.json - can inspect data in the console
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

        
        // PLOTTING BUBBLE CHART 
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


          // BONUS - GAUGE CHART:
          // https://plotly.com/javascript/gauge-charts/
          // Colour palette - https://gka.github.io/palettes/#/9|s|fbffc0,d2f3b2,4ec53e|ffffe0,ff005e,93003a|1|1
          d3.json("samples.json").then(function(data) { 
            var initialGauge = data.metadata[0];
            var initialWashFrequency = initialGauge.wfreq;
            console.log(`Washing frequency for ${idNumber}: ${initialWashFrequency}`);
    
            var dataThree = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: initialWashFrequency,
                    title: { text: "Scrubs Per Week"},
                    type: "indicator",
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 9 ]},
                        bar: { color: "#e0405f" },
                        steps: [
                            { range: [0, 1], color: '#f6eef0'},
                            { range: [1, 2], color: '#fae4dc'},
                            { range: [2, 3], color: '#fdd9c7'},
                            { range: [3, 4], color: '#ffcfb2'},
                            { range: [4, 5], color: '#ffc69c'},
                            { range: [5, 6], color: '#ffbc84'},
                            { range: [6, 7], color: '#ffb269'},
                            { range: [7, 8], color: '#ffa848'},
                            { range: [8, 9], color: '#ff9d00'}
                        ]
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


// Creating a function to handle change in dropdown menu
function optionChanged(subject_id) {
    d3.json("samples.json").then(function(data) { 
        var samples = data.samples;
        var filteredSamples = samples.filter(x => x.id == subject_id);
        // to remove an error message that I was receiving when calling sample_values
        if(filteredSamples[0] == undefined){
            return;
        };
        var selectedSampleValues = filteredSamples[0].sample_values;
        console.log(`Sample values for ${subject_id}: ${selectedSampleValues}`);
        var selectedOtuIds = samples.filter(x => x.id == subject_id)[0].otu_ids;
        console.log(`OTU ids for selected ${subject_id}: ${selectedOtuIds}`);
        var selectedLabels = samples.filter(x => x.id == subject_id)[0].otu_labels;
        console.log(`OTU labels for selected ${subject_id}: ${selectedLabels}`);

        // BAR CHART - TOP 10 VALUES:

        // Sorting the array of sample values in descending order
        var selectedValuesSorted = Array.from(selectedSampleValues).sort((a, b) => b-a);
        // Slicing the first 10 objects for plotting
        var selectedValuesSliced = selectedValuesSorted.slice(0, 10);
        // Reverse the array to accommodate Plotly's defaults
        var selectedValuesReversed = selectedValuesSliced.reverse();

        // For the y labels
        var selectedOtuIdsSliced = selectedOtuIds.slice(0, 10);
        var selectedOtuIdsReversed = selectedOtuIdsSliced.reverse();
        // OTU id's are currently integers which changes the way they are plotted on the y axis
        // Using map to create a new array with OTU added as a string infront of each ID 
        var selectedOtuLabels = selectedOtuIdsReversed.map(y => "OTU " + y);

        // For the hover text
        var selectedLabelsSliced = selectedLabels.slice(0, 10);
        var selectedLabelsReversed = selectedLabelsSliced.reverse();

        // Plotting horizontal bar chart
        var trace1 = {
            type: "bar",
            x: selectedValuesReversed,
            y: selectedOtuLabels,
            text: selectedLabelsReversed, 
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

        // BUBBLE CHART:
        // https://plotly.com/javascript/bubble-charts/
        var trace2 = {
            x: selectedOtuIds,
            y: selectedSampleValues,
            text: selectedLabels,
            mode: 'markers',
            marker: {
              size: selectedSampleValues,
              color: selectedOtuIds // red colour gradient by default, would be able to change
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

    
    // DEMOGRAPHIC INFORMATION:
    // defining a function to pull out demographic info, depending on subject_id
    function demographicInfo() {
        d3.json("samples.json").then(function(data) { 
            var metadata = data.metadata;
            var filteredMetadata = metadata.filter(x => x.id == subject_id);
            // appending it to the demographic info panel
            var select = d3.select("#sample-metadata"); 
            // to clear any existing metadata
            select.html("");
            // `Object.entries` to add each key and value pair to the panel
            Object.entries(filteredMetadata[0]).forEach(([key,value]) =>{
            select
              .append('p').text(`${key} : ${value}`)
            });

        });
    };
    demographicInfo()


    // BONUS - GAUGE CHART:
    // https://plotly.com/javascript/gauge-charts/
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
                    bar: { color: "#e0405f" },
                    steps: [
                        { range: [0, 1], color: '#f6eef0'},
                        { range: [1, 2], color: '#fae4dc'},
                        { range: [2, 3], color: '#fdd9c7'},
                        { range: [3, 4], color: '#ffcfb2'},
                        { range: [4, 5], color: '#ffc69c'},
                        { range: [5, 6], color: '#ffbc84'},
                        { range: [6, 7], color: '#ffb269'},
                        { range: [7, 8], color: '#ffa848'},
                        { range: [8, 9], color: '#ff9d00'}
                    ]
                }
                
            }
        ];
        
        var layout = { width: 600, height: 500, margin: { t: 50, b: 50 } };
        
        Plotly.newPlot('gauge', dataThree, layout);

    });
    });

};
optionChanged()
