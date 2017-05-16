/**
 * Created by bala on 8/5/17.
 */

/* eslint-disable no-underscore-dangle, no-param-reassign */
//import d3 from 'd3';
//import d3Tip from "d3-tip";

import * as d3 from 'd3';
import 'd3-tip/examples/example-styles.css';
const d3tip = require('imports-loader?define=>false,this=>window!d3-tip');
d3tip(d3);


import { category21 } from '../javascripts/modules/colors';
import { wrapSvgText } from '../javascripts/modules/utils';
import { bnbColors } from '../javascripts/modules/colors';


require('./coffee_wheel.css');

// Modified from http://bl.ocks.org/kerryrodden/7090426

function coffeeWheelVis(slice, payload) {
    const div = d3.select(slice.selector);
    div.html(''); // reset

    function formatInput(input,cols,colorInput){

        if(!colorInput){
            colorInput = bnbColors;
        }


        var len=input.length;

        var colorRotater=0;

        /*This function takes an Array of Objects where each object has a parameter called "name",
         returns dictionary (names:index) where index gives the location of object in array*/
        function dictOfNames(objArray){
            var dic={};
            var i=0;
            for(i=0;i<objArray.length;i++){
                var curr=objArray[i].name;
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

            //For creating objects for the last column
            if(colNumber==cols.length-1){
                for(i=0;i<len;i++){
                    if(typeof(data[i][key]) == "undefined" || data[i][key] == "" || data[i][key] == null){
                        continue;
                    }

                    if(!(data[i][key] in dict)){
                        res.push({"name": data[i][key],"colour" : colorInput[colorRotater%colorInput.length]});
                        dict[data[i][key]]=res.length-1;
                        colorRotater+=1;
                    }
                }
            }

            //For creating objects corresponding to columns other than last column
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
                            parentObj.children.push(childObjectArray[childDict[childName]]);
                            childrenAdded[childName]=1;
                        }
                    }
                    else{
                        //If this folk has not been added to the res array, we need to create an object for him and add him to result array.
                        var parentObj={
                            "name": parentName,
                            "children": []
                        };
                        parentObj.children.push(childObjectArray[childDict[childName]]);
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
        for(i=cols.length-1;i>=0;i--){
            parentArray=arrayOfColumn(input,cols,i,childArray,childDict);
            parentDict=dictOfNames(parentArray);

            //Storing current col objects, so that they can be passed as children arguments for the next column i.e., parent
            childArray=parentArray;
            childDict=parentDict;
        }

        return parentArray;
    }

    var input=formatInput(payload.data.records,payload.data.columns,payload.data.colors);

    /*====================================================================================================================*/
    function isParentOf(n, e) {
        return n === e ? !0 : n.children ? n.children.some(function(n) {
                    return isParentOf(n, e)
                }) : !1
    }

    function colour(d) {
        if (d.colour == undefined && d.children) {
            // There is a maximum of two children!
            var colours = d.children.map(colour);
            var sum = { r: 0, g: 0, b: 0 };
            for(var i=0; i < colours.length; i++) {
                var aColor = d3.rgb(colours[i]);
                sum.r = Math.max(aColor.r, sum.r);
                sum.g = Math.max(aColor.g, sum.g);
                sum.b = Math.max(aColor.b, sum.b);
            }
            return d3.rgb(sum.r, sum.g, sum.b);
        }

        return d.colour || "#fff";
    }

    function arcTween(t) {
        var n = maxY(t),
            e = d3.interpolate(d.domain(), [t.x, t.x + t.dx]),
            a = d3.interpolate(um.domain(), [t.y, n]),
            i = d3.interpolate(um.range(), [t.y ? 20 : 0, o]);
        return function(t) {
            return function(n) {
                return d.domain(e(n)), um.domain(a(n)).range(i(n)), x(t)
            }
        }
    }

    function maxY(t) {
        return t.children ? Math.max.apply(Math, t.children.map(maxY)) : t.y + t.dy
    }

    function brightness(t) {
        //return .299 * t.maxY + .587 * t.g + .114 * t.b
        return ((t.r*299)+(t.g*587)+(t.b*114))/1000;
    }

    var tip = d3.tip()
        .attr('class', 'd3-tip-coffee-wheel')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>"+d.name.toUpperCase()+"</strong>";
        });

    //d3.select(this).call(tip);

    const fd = payload.form_data;
    const json = payload.data;
    const width = slice.width();
    const height = slice.height();
    const data = json.data;

    var i = Math.min(width,height),
        l = i,
        o = i / 2,
        radius = i/2,
        d = d3.scale.linear().range([0, 2 * Math.PI]),
        //u = d3.scale.linear().domain([0,1]).range([0,o])
        u = d3.scale.pow().exponent(1.3).domain([0, 1]).range([0, o]),
        um = d3.scale.linear().domain([0, 1]).range([0, o]),
        c = 5,
        s = 1e3;

    var f = div.append("svg").attr("class","coffee-wheel-svg").attr("width", height).attr("height", height).append("g").attr("class","coffee-wheel-g").attr("transform", "translate(" + [o + 1, o ] + ")");

    var p = d3.layout.partition().sort(null).value(function(t) {
            return 5.8 - t.depth
        }),
        x = d3.svg.arc().startAngle(function(t) {
            return Math.max(0, Math.min(2 * Math.PI, d(t.x)))
        }).endAngle(function(t) {
            return Math.max(0, Math.min(2 * Math.PI, d(t.x + t.dx)))
        }).innerRadius(function(t) {
            return Math.max(0, t.y ? um(t.y) : t.y)
        }).outerRadius(function(t) {
            return Math.max(0, um(t.y + t.dy))
        });

    function activeWheel(){
        var i=input;
        var maxDepth = 0;

        if(typeof(i)!="undefined"){
            function findDepth(arr,value){
                if(arr.length == 0){
                    if(value>maxDepth){
                        maxDepth=value;
                    }
                }else{
                    var j=0;
                    for(j=0;j<arr.length;j++){
                        if(typeof(arr[j].children)!="undefined" && arr[j].children.length>0){
                            findDepth(arr[j].children,value+1);
                        }
                        else{
                            if(value>maxDepth){
                                maxDepth=value;
                            }
                        }
                    }
                }
            }
            findDepth(i,1);
            maxDepth+=1;
        }


        function click(n) {
            h.transition().duration(s).attrTween("d", arcTween(n)), m.style("visibility", function(e) {
                return isParentOf(n, e) ? null : d3.select(this).style("visibility")
            }).transition().duration(s).attrTween("text-anchor", function(t) {
                return function() {
                    return d(t.x + t.dx / 2) > Math.PI ? "end" : "start"
                }
            }).attrTween("transform", function(t) {
                var n = (t.name || "").split(" ").length > 1;
                return function() {
                    var e = 180 * d(t.x + t.dx / 2) / Math.PI - 90,
                        //r = e + (n ? -.5 : 0);
                        r = e;
                    return "rotate(" + r + ")translate(" + (um(t.y)+c) + ")rotate(" + (e > 90 ? -180 : 0) + ")"
                }
            }).style("fill-opacity", function(e) {
                return isParentOf(n, e) ? 1 : 1e-6
            })
                .each("end", function(e,index) {

                    var self = d3.select(this);

                    if(isParentOf(n,e)){
                        self.style("visibility",null);
                        if(typeof(e.name) != "undefined"){

                            self[0][0].innerHTML = "<tspan>"+e.name+"</tspan>";

                            if(maxDepth - n.depth > 0){
                                var temp = 1/(maxDepth - n.depth);

                                var self = d3.select(this);
                                var textLength = self.node().getComputedTextLength();

                                var text = self.html();
                                var storeText = self.html();

                                while (textLength >  (temp*radius-2*c) && text.length > 0) {
                                    text = text.slice(0, -1);
                                    self.html(text + "&hellip;")
                                    textLength = self.node().getComputedTextLength();
                                }

                            }
                        }

                    }
                    else{
                        d3.select(this).style("visibility","hidden");
                    }
                });

            h.on('mouseenter',function(d,i){
                var self = d3.select(this);
                self.call(tip);
                if(typeof(d.name) != "undefined")
                    tip.show(d,document.getElementById("path-"+i.toString()));
            })
                .on('mouseleave',tip.hide);

        }

        var o = p.nodes({
                children: i
            }),
            h = f.selectAll("path").data(o);
        h.enter().append("path").attr("id", function(t, n) {
            return "path-" + n
        }).attr("d", x).attr("fill-rule", "evenodd").style("fill", colour)
            .on("click", click)
            .on('mouseenter',function(d,i){
                var self = d3.select(this);
                self.call(tip);
                if(typeof(d.name) != "undefined")
                    tip.show(d,document.getElementById("path-"+i.toString()));
            })
            .on('mouseleave',tip.hide);

        var m = f.selectAll("text").data(o),
            y = m.enter().append("text").style("fill-opacity", 1)
                .style("fill", function(d) {
                    return brightness(d3.rgb(colour(d))) < 128 ? "#fff" : "#000";
                })
                .attr("text-anchor", function(t) {
                    return d(t.x + t.dx / 2) > Math.PI ? "end" : "start"})
                .attr("dy", "0.2em").attr("transform", function(t) {
                    var n = (t.name || "").split(" ").length > 1,
                        e = 180 * d(t.x + t.dx / 2) / Math.PI - 90,
                        //r = e + (n ? -.5 : 0);
                        r = e;
                    return "rotate(" + r + ")translate(" + (um(t.y)+c) + ")rotate(" + (e > 90 ? -180 : 0) + ")"
                }).on("click", click);



        y.append('tspan').attr("id", function(t, n) {
            return "tspan-" + n
        })
            .html(function(d,n) {
                if(typeof(d.name) == "undefined"){
                    return d.name;
                }
                else{
                    return d.name;
                }
            })
            .attr("title",function(d){
                return d.name;
            })
            .each(function(t){

                var self = d3.select(this),
                    textLength = self.node().getComputedTextLength();

                var text = self.html();
                var storeText = self.html();

                while (textLength >  (um(t.dy)-2*c) && text.length > 0) {
                    text = text.slice(0, -1);
                    self.html(text + "&hellip;")
                    textLength = self.node().getComputedTextLength();
                }

            });


    }

    activeWheel();
}

module.exports = coffeeWheelVis;
