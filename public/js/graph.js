/**
*
* One Graph to Rule Them All.
*
*/

// The vertex object
var Vertex = function (div_id) {
    this.img = '/img/user.png';
    this.identifier = div_id;
    this.endpoints = new Array();
    
    this.addEndpoint = function(anc) { // Add an endpoint to the vertex
        var endpoint = jsPlumb.addEndpoint(div_id, {
            connectorStyle: {lineWidth: 7, strokeStyle: "#ddd"},   
            paintStyle: { fillStyle: "#aaa", outlineColor: "black", outlineWidth: 1 },
            isSource: true,
            maxConnections: 10,
            isTarget: true,
            dropOptions: { tolerance: "touch", hoverClass: "dropHover" },
            anchors: anc
        });
        this.endpoints.push(endpoint);
        return endpoint;
    };
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
        this.edges.forEach(function (ele, i, arr) {
            if (!ele.rendered) {
                var eSource = ele.source.addEndpoint([[0.2, 0, 0, -1], [1, 0.2, 1, 0], [0.8, 1, 0, 1], [0, 0.8, -1, 0]]);
                var eTarget = ele.target.addEndpoint([[0.6, 0, 0, -1], [1, 0.6, 1, 0], [0.4, 1, 0, 1], [0, 0.4, -1, 0]]);
                jsPlumb.connect({
                    source: eSource,
                    target: eTarget
                });
                ele.rendered = true;
            }
        });
    };
    
    this.addEdge = function (source, target) { // Add an edge to the graph
        var edge = new Edge(source, target);
        this.edges.push(edge);
        var _this = this;
        setTimeout(function () {
            _this.renderGraph();
        }, 100);
        return edge;
    };
    
    this.addVertex = function(div_id) {
        var vertex = new Vertex(div_id);
        this.vertices.push(vertex);
        return vertex;
    };
    
    this.addVertexWithParent = function (div_id, parentId) {
        var parent, i;
        this.vertices.forEach(function (ele, i, arr) {
            if (ele.identifier === parentId) {
                parent = ele;
                return;
            }
        });
        if (!parent) {
            return null;
        }
        var vert = this.addVertex(div_id);
        this.addEdge(parent, vert);
        return vert;
    };
};
