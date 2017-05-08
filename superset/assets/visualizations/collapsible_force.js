/* eslint-disable no-param-reassign */
import d3 from 'd3';
import { bnbColors } from '../javascripts/modules/colors';


require('./collapsible_force.css');

/* Modified from http://bl.ocks.org/d3noob/5141278 */
function collapsibleForceVis(slice, json) {
    const div = d3.select(slice.selector);

    div.selectAll('*').remove();

    const width = slice.width();
    const height = slice.height() - 25;

    //Array Shuffler
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    const colorArray = shuffleArray(bnbColors);


    //Find the max value of size in whole data
    function findMax(inp, res){

        if(typeof(inp) == "object"){
            if(typeof(inp.length) == "undefined"){
                if(typeof(inp.size) != "undefined"){
                    return Math.max(res,parseInt(inp.size));
                }
                else{
                    if(typeof(inp.children) != "undefined"){
                        if(inp.children != null){
                            var i=0;
                            for(i=0;i<inp.children.length;i++){
                                res = Math.max(res, findMax(inp.children[i],res));
                            }
                        }
                        else{
                            var i=0;
                            for(i=0;i<inp._children.length;i++){
                                res = Math.max(res, findMax(inp._children[i],res));
                            }
                        }
                    }
                    else{
                        console.log("Issue with children for ",inp);
                    }
                }
            }
            else{
                var i=0;
                for(i=0;i<inp.length;i++){
                    res = Math.max(res, findMax(inp[i],res));
                }
            }
        }
        else{
            console.log("SOME ERROR in FINDSIZE FN with input type ");
        }

        return res;
    }

    //Find size of node. If its leaf node, its size is returned, else aggregate sum of children's size will be returned
    function findCumulativeSize(d){
        if(d.size || d.csize){
            return d.csize = (d.size || d.csize);
        }
        else if(d.children){
            return d.children.reduce(function(acc, child){
                child.csize = findCumulativeSize(child);
                return acc + child.csize;
            },0);
        }
        else{
            return d.csize = 1;
        }
    }

    //To find depth of a node recursively. As part of recursive call, if child nodes depth is computed, its saved.
    function findMaxDepth(d,field){
        var maxField = 0;
        if(d[field]){
            maxField = d[field];
        }
        else{
            if(d.children){
                maxField = d.children.reduce(function(acc,child){
                    var maxChildField = findMaxDepth(child, field);
                    child[field] = maxChildField;
                    return Math.max(acc,maxChildField);
                },0);
                maxField++;
            }
        }
        return maxField;
    }

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>"+"Name : "+d.name+"</strong><br>"+"<strong>"+"Value : "+d.csize+"</strong><br><strong>";
        });

    var root, min=width/500, max=width/50;

    var force = d3.layout.force()
        .linkDistance(parseFloat(json.form_data.link_length))
        .charge(parseFloat(json.form_data.charge))
        .gravity(parseFloat(json.form_data.gravity))
        .size([width, height])
        .on("tick", tick);

    var svg = div.append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");




    function formatInput(input,cols){

        var len=input.length;

        var colorRotater=0;

        var metricColumn = json.form_data.metric;

        /*This function takes an Array of Objects where each object has a parameter called "name",
         returns dictionary (names:index) where index gives the location of object in array*/
        function dictOfNames(objArray){
            var dic={};
            var i=0;
            for(i=0;i<objArray.length;i++){
                var curr=objArray[i]["name"];
                if(!(curr in dic)){
                    dic[curr]=Object.keys(dic).length;
                }
            }
            return dic;
        }

        /*This does the main Functionality. It returns objects with unique names from the column. It adds the children which
         correspond to the adjacent column */
        function arrayOfColumn(data,cols,colNumber,childObjectArray,childDict){
            var res=[];
            var i=0;
            var key=cols[colNumber];
            var dict={}

            //For creating objects for the last but one column
            if(colNumber==cols.length-2){
                for(i=0;i<len;i++){

                    if(typeof(data[i][key]) == "undefined" || data[i][key] == "" || data[i][key] == null){
                        continue;
                    }

                    if(!(data[i][key] in dict)){
                        res.push({"name": data[i][key],"size" : parseInt(data[i][metricColumn])});
                        dict[data[i][key]]=res.length-1;
                        colorRotater+=1;
                    }
                }
            }

            //For creating objects corresponding to columns other than last and last column
            else{
                var childKey=cols[colNumber+1];
                var childrenAdded={}
                for(i=0;i<len;i++){
                    var parentName=data[i][key];
                    var childName=data[i][childKey];

                    if(typeof(parentName) == "undefined" || parentName == "" || parentName == null){
                        continue;
                    }

                    if(parentName in dict){
                        //If this folk has already been added to res array, we just have to update his children array
                        var indexOfParent=dict[parentName];
                        var parentObj=res[indexOfParent];

                        //We check if current child has been added to children list. If yes, we don't add
                        if(!(childName in childrenAdded)){
                            parentObj["children"].push(childObjectArray[childDict[childName]]);
                            childrenAdded[childName]=1;
                        }
                    }
                    else{
                        //If this folk has not been added to the res array, we need to create an object for him and add him to result array.
                        var parentObj={
                            "name": parentName,
                            "children": []
                        };
                        parentObj["children"].push(childObjectArray[childDict[childName]]);
                        res.push(parentObj);
                        dict[parentName]=res.length-1;
                        childrenAdded[childName]=1;
                    }
                }
            }
            return res;
        }

        var i=0;
        var parentArray=[];
        var childArray=[];
        var parentDict={};
        var childDict={};
        if(cols.length == 1){
            parentArray.push({ "name":"Full Groupby" , "size":data[0][metricColumn]});
        }
        else{
            for(i=cols.length-2;i>=0;i--){
                parentArray=arrayOfColumn(input,cols,i,childArray,childDict);
                parentDict=dictOfNames(parentArray);

                //Storing current col objects, so that they can be passed as children arguments for the next column i.e., parent
                childArray=parentArray;
                childDict=parentDict;
            }
        }

        return parentArray;
    }

    var input=formatInput(json["data"]["records"],json["data"]["columns"]);

    root = input;

    var overallMax = 0;

    if(typeof(root.length) == "undefined"){
        overallMax = findMax(root,0);
        // overallMax = findMaxSize(root);
    }
    else{
        var i=0;
        for(i=0;i<root.length;i++){
            overallMax = Math.max(overallMax,findMax(root[i],0));
            // overallMax = Math.max(overallMax,findMaxSize(root[i]));
        }
    }

    var scale =  d3.scale.linear().domain([0,overallMax]).range([width/500,width/50]);

    update();

    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
            .nodes(nodes)
            .links(links)
            .start();

        // Update links.
        link = link.data(links, function(d) { return d.target.id; });

        link.exit().remove();

        link.enter().insert("line", ".node")
            .attr("class", "link");

        // Update nodes.
        node = node.data(nodes, function(d) { return d.id; });

        node.exit().remove();

        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .on("click", click)
            .call(force.drag);


        //d3.selectAll(".node").call(tip);

        nodeEnter.append("circle")
        //.attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; });
            .attr("r", function(d) {
                d.level = findMaxDepth(d, 'level');
                d.csize = findCumulativeSize(d);

                console.log(d.name, d.csize);

                if(d.children || d._children){
                    return 10;
                }
                else {
                    return scale(d.size);
                }
            })
            .attr("id",function(d){
                return slice.containerId+"-circle-"+d.id.toString();
            })
            .on('mouseenter',function(d){
                var self = d3.select(this);
                self.call(tip);
                tip.show(d,document.getElementById(slice.containerId+"-circle-"+d.id.toString()));
            })
            .on('mouseleave',tip.hide);

        node.select("circle")
            .style("fill",color);

        nodeEnter.append("text")
            .attr("dy", ".35em")
            .text(function(d) { return d.name; })
            .each(function(d){
                var self = d3.select(this);
                var len =  self.node().getComputedTextLength();
                var temp = 0;
                if(d.children || d._children){
                    temp = 10;
                }
                else {
                    temp=scale(d.size);
                }
                //self.attr("dx",len > 2*temp  ? (len/2+temp+5) : (temp + len));
                self.attr("dx",temp+5);
            });

    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function color(d) {
        //return bnbColors[d.level] || '#3182bd';
        return d._children ? "#00d1c1" : (colorArray[d.level % colorArray.length] || '#3182bd');

        // return d._children ? "#3182bd" // collapsed package
        //     : d.children ? "#c6dbef" // expanded package
        //         : "#fd8d3c"; // leaf node
    }

    // Toggle children on click.
    function click(d) {
        if (d3.event.defaultPrevented) return; // ignore drag
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update();
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {

        var nodes = [], i = 0;

        function recurse(node) {
            if (node.children) node.children.forEach(recurse);
            if (!node.id) node.id = ++i;
            nodes.push(node);
        }

        if(typeof(root.length) != "undefined" ){
            var j = 0;
            for(j = 0;j<root.length;j++){
                recurse(root[j]);
            }
        }
        else{
            recurse(root);
        }

        return nodes;
    }
}

module.exports = collapsibleForceVis;
