// need to change it so that the data for 940 is visual on opening browser
// CHANGE VARIABLE NAMES IN FIRST PART OF CODE - referring to bar chart but actually use them for the bubble chart

// 1. Use the D3 library to read in samples.json.

d3.json("samples.json").then(function(data){ 
    console.log(data);
    
});

// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

function dropdown() {
    // grabbing the element not the value
    var subjectSelect = d3.select("#selDataset")
    d3.json("samples.json").then((data => {
        // pulling out the names
        var names = data.names;
        names.forEach((sample) => {
            // this appends rows in html with option tag <option>940</option>
            subjectSelect.append("option").text(sample).property("value", sample)
        })
    }))
};
dropdown()


// creating a function for every time the dropdown is changed, all other functions and plots are defined within this
function optionChanged(subject_id) {
    d3.json("samples.json").then(function(data) { 
        var samples = data.samples;
        var filteredSamples = samples.filter(x => x.id == subject_id);
        console.log(`filtered samples: ${filteredSamples}`);
        // to remove an error message that I was receiving when calling sample_values
        // Ryan helped with this
        if(filteredSamples[0] == undefined){
            return;
        };
        var valuesBarChart = filteredSamples[0].sample_values;
        console.log(`Sample values for selected subject id: ${valuesBarChart}`);
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
              color: labelsBarChart
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
          
          // Render the plot to the div tag with id "bar"
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

        })
    };
    demographicInfo()


    })
};


optionChanged()






// HW SESSION - this pulls out sample values for one 
// d3.json("samples.json").then(function(data){ 
//     var samples = data.samples;
//     console.log(samples.filter(x => x.id == "940")[0].sample_values);
    
// });

// could use this instead trying to work out error message
// var values_barchart = samples.filter(x => x.id == subject_id);
//         var values_barchart1 =  values_barchart[0];
//         var values_barchart2 = values_barchart1.sample_values;
//         console.log(`Sample values for selected subject id: ${values_barchart2}`);