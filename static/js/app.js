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
        var ValuesBarChartSorted = Array.from(valuesBarChart).sort((a, b) => b-a);
        console.log(`Sorted sample values for selected subject id: ${ValuesBarChartSorted}`);
    })
};

optionChanged()

// // An unsorted array
// numArray = [9.9, 6.1, 17.1, 22.7, 4.6, 8.7, 7.2];

// // Sort the array in descending order and assign the results to a variable
// var numArraySorted = Array.from(numArray).sort((a, b) => b-a)

// // Print the results to the console
// console.log("numArray", numArray);
// console.log("numArray descending", numArraySorted)


// // Sort the data by Greek search results
// var sortedByGreekSearch = data.sort((a, b) => b.greekSearchResults - a.greekSearchResults);
// console.log(sortedByGreekSearch);

// // Slice the first 10 objects for plotting
// slicedData = sortedByGreekSearch.slice(0, 10);
// console.log(slicedData);

// // Reverse the array to accommodate Plotly's defaults
// reversedData = slicedData.reverse();
// console.log(reversedData);



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