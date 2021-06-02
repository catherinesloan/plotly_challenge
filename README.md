# plotly_challenge
[Click here to view deployed app]https://catherinesloan.github.io/plotly_challenge/

**If cloning the repository...** 
1. Activate python environment 
2. Run "python -m http.server" in terminal
3. Use local host to view in browser, otherwise CORS error in index.html file

### Background: 
The [dataset](https://github.com/catherinesloan/plotly_challenge/blob/master/samples.json) reveals that a small handful of microbial species (also called operational taxonomic units, or OTUs, in the study) were present in more than 70% of people, while the rest were relatively rare.

### Task:
To build an interactive dashboard to explore the Belly Button Biodiversity dataset, which catalogs the microbes that colonise human navels.

### Output:
Used the D3 Library to read in [samples.json](https://github.com/catherinesloan/plotly_challenge/blob/master/samples.json)

Created a **dropdown menu** in [index.html](https://github.com/catherinesloan/plotly_challenge/blob/master/index.html) with all subject ID's. 

On change, each of the 4 visualisations updates from [app.js](https://github.com/catherinesloan/plotly_challenge/blob/master/static/js/app.js) ...

1. **Demographic information** for selected individual

2. A **horizontal bar chart** with a dropdown menu to display the top 10 OTUs found in that individual:
   - sample_values as the values 
   - otu_ids as the labels
   - otu_labels as the hovertext for the chart
   
3. A **bubble chart** that displays each sample:
   - otu_ids for the x values
   - sample_values for the y values
   - sample_values for the marker size
   - otu_ids for the marker colors
   - otu_labels for the text values

4. **Gauge Chart** to plot the weekly washing frequency of the individual
   - Extra challenge - add a needle/arrow to the gauge chart






