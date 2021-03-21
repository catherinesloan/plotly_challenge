
// need to change it so that the data for 940 is visual on openong browser

// 1. Use the D3 library to read in samples.json.

d3.json("samples.json").then(function(data){ 
    console.log(data);
    
});



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


// 2. Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.

function optionChanged(subject_id) {
    d3.json("samples.json").then(function(data) { 
        var samples = data.samples;
        var valuesBarChart = samples.filter(x => x.id == subject_id)[0].sample_values;
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
        console.log(`Top 10 sample labels for selected subject id: ${labelsBarChartSliced}`);

        // Reverse the array to accommodate Plotly's defaults
        var labelsBarChartReversed = labelsBarChartSliced.reverse();
        console.log(`Top 10 sample labels reversed: ${labelsBarChartReversed}`);

        // OTU id's are currently integers which changes the way they are plotted on the y axis
        // Using map to create a new array with OTU added as a string infront of each ID 
        var labels = labelsBarChartReversed.map(y => "OTU " + y);
        console.log(`OTU IDs: ${labels}`);

        // DOING THE SAME FOR HOVER TEXT

        




        var trace1 = {
            type: "bar",
            x: valuesBarChartReversed,
            y: labels,
            orientation: 'h'
            // NEED HOVER TEXT ** 
        }

        // data
        var data = [trace1];
        
        // Apply the group bar mode to the layout
        var layout = {
            title: `Top 10 OTU's for ID No.${subject_id}`,
            margin: {
                l: 100,
                r: 100,
                b: 100,
                // reduced to 30 so plot sits under title nicely
                t: 30
            }
        } 

        // Render the plot to the div tag with id "bar"
        Plotly.newPlot("bar", data, layout);

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