/**
*
* One Graph to Rule Them All.
*
*/

// The vertex object
var Vertex = function (div_id) {
    this.img = 'http://placehold.it/150x150';
    this.identifier = div_id;
    var _this = this;
    setTimeout(function () {
        _this.endpoint = jsPlumb.addEndpoint(div_id, {
            connectorStyle:{
                lineWidth:7,
                strokeStyle:"#bbb",
                dashstyle:"2 2"
            },
            isSource: true,
            maxConnections: 10,
            isTarget: true,
            dropOptions: {
                tolerance: "touch",
                hoverClass: "dropHover"
            }
        });
        jsPlumb.draggable(jsPlumb.getSelector(".node"));
    }, 150);
};

// The edge object
var Edge = function (s, t) {
    this.source = s; // The source vertex
    this.target = t; // The target vertex
    this.rendered = false;
};

// The graph object
var Graph = function () {
    this.vertices = []; // Vertices of the graph
    this.edges = []; // Edges of the graph
    
    this.renderGraph = function () { // Render the connections of the graph
        for (i in this.edges) {
            if (!this.edges[i].rendered) {
                console.log(this.edges[i].source.endpoint);
                console.log(this.edges[i].target.endpoint);
                jsPlumb.connect({
                    source: this.edges[i].source.endpoint,
                    target: this.edges[i].target.endpoint
                });
                this.edges[i].rendered = true;
            }
        }
    };
    
    this.addEdge = function (source, target) { // Add an edge to the graph
        var edge = new Edge(source, target);
        this.edges.push(edge);
        var _this = this;
        setTimeout(function () {
            _this.renderGraph();
        }, 500);
        return edge;
    };
    
    this.addVertex = function(div_id) {
        var vertex = new Vertex(div_id);
        this.vertices.push(vertex);
        return vertex;
    };
    
    this.addVertexWithParent = function (div_id, parentId) {
        var parent = undefined, i;
        for (i in this.vertices) {
            if (this.vertices[i].identifier === parentId) {
                parent = this.vertices[i];
                break;
            }
        }
        if (!parent)
            return null;
        var vert = this.addVertex(div_id);
        this.addEdge(parent, vert);
        return vert;
    };
}
