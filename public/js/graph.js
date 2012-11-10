/**
*
* One Graph to Rule Them All.
*
*/

// The vertex object
var Vertex = function (div_id) {
    this.cartridges = [];//[{ img: '/img/user.png' }];
    this.identifier = div_id;
    this.endpoints = [];
    this.top = $(window).height()/2 - 100;
    this.left = $(window).width()/2 - 100;
    this.properties = {
        size : "small",
        autoScale: false,
        app : {git:"" ,app:"",ssh:""},
        cartridge: []
    };
    this.deployed = false;

    this.addEndpoint = function (anc) { // Add an endpoint to the vertex
        var endpoint = jsPlumb.addEndpoint(div_id, {
            isSource: false,
            maxConnections: 10,
            isTarget: false,
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
    this.connection = undefined;
    this.rendered = false;
};

// The graph object
var Graph = function () {
    this.vertices = []; // Vertices of the graph
    this.edges = []; // Edges of the graph

    this.renderGraph = function () { // Render the connections of the graph
        this.edges.forEach(function (ele, i, arr) {
            if (!ele.rendered) {
                var eSource = ele.source.addEndpoint("Continuous");
                var eTarget = ele.target.addEndpoint("Continuous");
                ele.connection = jsPlumb.connect({
                    source: eSource,
                    target: eTarget
                });
                ele.rendered = true;
            }
        });
    };

    this.addVertex = function (div_id) { // Add a vertex to the graph
        var vertex = new Vertex(div_id);
        this.vertices.push(vertex);
        return vertex;
    };

    this.removeVertex = function (div_id) { // Delete a vertex
        var i;
        // Delete all related edges
        var dels = [];
        for (i = 0; i < this.edges.length; i = i + 1) {
            if (this.edges[i].source.identifier === div_id || this.edges[i].target.identifier === div_id) {
                this.edges[i].connection.endpoints.forEach(function (ele, j, arr) {
                    jsPlumb.deleteEndpoint(ele);
                });
                dels.push(i);
            }
        }
        for (i = 0; i < dels.length; i = i + 1) {
            this.edges.splice(dels[i]);
        }
        // Delete vertex
        for (i = 0; i < this.vertices.length; i = i + 1) {
            if (this.vertices[i].identifier === div_id) {
                this.vertices.splice(i);
                break;
            }
        }

    };

    this.addEdge = function (source, target) { // Add an edge to the graph (Expects vertex objects)
        var edge = new Edge(source, target);
        this.edges.push(edge);
        var _this = this;
        setTimeout(function () {
            _this.renderGraph();
        }, 100);
        return edge;
    };

    this.addVertexWithParent = function (div_id, parentId) { // Add a vertex along with an edge to the parent
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
        var ppos = $('#'+parentId).position();
        do {
            var rand=(Math.random()*Math.PI*2)+1;
            var rad = 200 + (Math.random()*100)+1;
            vert.top = ppos.top + rad*Math.sin(rand);
            vert.left = ppos.left + rad*Math.cos(rand);
        } while (vert.top < 60 || vert.left > $(document).width()-150 || vert.top > $(document).height()-200);
        this.addEdge(parent, vert);
        return vert;
    };
};
