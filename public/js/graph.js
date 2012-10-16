/**
*
* One Graph to Rule Them All.
*
*/

// The vertex object
var Vertex = function (div_id) {
    var img = 'http://placehold.it/120x80';
    this.endpoint = jsPlumb.addEndpoint(div_id, endpoint);
};

// The edge object
var Edge = function () {
    this.source = undefined; // The source vertex
    this.target = undefined; // The target vertex
    this.rendered = false;
};

// The graph object
var Graph = function () {
    this.vertices = []; // Vertices of the graph
    this.edges = []; // Edges of the graph
    
    this.renderGraph = function () { // Render the connections of the graph
        for (i in this.edges) {
            if (!this.edges[i].rendered) {
                jsPlumb.connect({
                    source: this.edges[i].source.endpoint,
                    target: this.edges[i].target.endpoint
                });
            }
        }
    });
}
