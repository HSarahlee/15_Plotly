// Create a function to read and grab values from samples.json file
function readData(sample) {
    d3.json("samples.json").then( (data) => {

        // Grab the "metatdata" from the dataset
        let metadata = data.metadata;

        // Grab the corresponding values for each sample id from metadata set
        let sampleIds = metadata.filter(sampleObj => sampleObj.id == sample);
        let sample_values = sampleIds[0];

        // Refere #sample-metadata
        let demographic = d3.select("#sample-metadata");

        // Reset the display
        demographic.html("");

        // Grab and display each sample values
        Object.entries(sample_values).forEach(([key, value]) => {
            demographic.append("h5")
                       .text(`${key.toUpperCase()}: ${value}`);
        });

    })}

// Creaet a function to create the charts
function createCharts(sample) {
    d3.json("samples.json").then ((data) => {
        
        // Getting sample values from the data
        let sampleData = data.samples;
        let sampleValues = sampleData.filter(sampleObj => sampleObj.id == sample);
        let filteredsample = sampleValues[0];
        
        // Getting the otu_ids, otu_labels, and sample_values from the data 
        let otu_ids = filteredsample.otu_ids;
        let otu_labels = filteredsample.otu_lables;
        let sample_values = filteredsample.sample_values;

        // Build a horizontal bar graph for Top 10 bacteria culture found
        let yticks = otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        let barData = [{
            y: yticks,
            x: sample_values.slice(0,10).reverse(),
            // text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"}];

            // Define a layout for the barchart
            let barLayout = {
                title: "Top 10 Bacteria Cultures Found",
                margin: { t : 30, l : 150}};

            // Display the barchart
            Plotly.newPlot("bar", barData, barLayout);
        
        // Build a bubble chart for bacteria cultures per sample
        let bubbleData = [{
            x : otu_ids,
            y : sample_values,
            text : otu_labels,
            mode : "markers",
            marker: { size : sample_values,
                      color : otu_ids,
                      colorscale : "Earth" }}];

            // Define a layeour for the bubble chart 
            let bubbleLayout = {
                title: "Bacteria Cultures Per Sample",
                margin: {t : 0},
                hovermode: "closet",
                xaxis: { title : "OTU ID" },
                margin: { t : 30 }};

            // Display the buble chart
            Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    });
}

// Create a function to grab newly selected data 
function init () {

    // Assign the dropdown select element
    let selection = d3.select("#selDataset");

    // Grab the the names and populate the select option 
    d3.json("samples.json").then((data) => {
        let names = data.names;

        //  Append each sample data 
        names.forEach( (sample) => {
            selection.append("option")
                     .text(sample)
                     .property("value", sample);
        });

        // Display the first sample from the data 
        let first = names[0];
        createCharts(first);
        readData(first);
    });
}

// Create a new function to switch data to the newly selected item for the display
function newData(newItem) {
    createCharts(newItem);
    readData(newItem);
}

// Initialize the dashboard
init ();

