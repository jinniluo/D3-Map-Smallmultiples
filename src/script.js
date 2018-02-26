//small multiples for each state
//use row and column method

//set up the divs and svgs
const w=$("body").width(),
      h=$("body").height();

const margin = {top: 10, right: 0, bottom: 0, left: 10},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

const gap=2,
      stateWidth=75,
      barChartWidth=stateWidth-gap;


//set up the scale for bar charts
var x = d3.scaleBand().rangeRound([0, barChartWidth]).padding(0.1),
    y = d3.scaleLinear().rangeRound([barChartWidth, 0]);


//set up a color scale for bars

var color = d3.scaleLinear().range(["#FF2B2B","#3ED100"]).domain([0,16]);

const svg = d3.select("body")
             .append("svg")
             .attr("class","canvas")
             .attr("width", w)
             .attr("height", h);


//load in the datasets
d3.queue()
    .defer(d3.json,"../data/data.json")
//    .defer(d3.csv, "../data/mapDict.csv")
//    .defer(d3.csv, "../data/data.csv",parseData)
    .await(ready);

function ready(error,nestByYear) {
  if (error) throw error;  

    
//  console.log()



    
    
//nest data by year and then by state and add col and row and add index
//const nestByYear=d3.nest().key((d)=>{return d.year}).key((d)=>{return d.state}).entries(income);
//console.log(nestByYear)
//    
//     dataProcessor(nestByYear,grid,dict);
    
      function refreshSwatch() {
      let slider = $( "#slider" ).slider( "value" );

          console.log(slider)
          const year=slider,
                map=nestByYear.map((d)=>{return d.key}).indexOf(JSON.stringify(year)),
                data=nestByYear[map].values;
          console.log(nestByYear[map].key,data)

          
          //add enter update and exit to this 
          d3.select(".plot").remove();
          draw(data);
      
    }
 
    $( "#slider" ).slider({
      value:2014,
      min: 2009,
      max: 2016,
      slide: refreshSwatch,
      change: refreshSwatch
    });
    
    $( "#slider" ).slider( "value", 2009 );
   
  


//      draw(data);
    
  
}





//data processor function
//function dataProcessor (nestByYear,grid,dict){
//     
//    nestByYear.forEach((m,j)=>{
//
//                const nest=m.values,
//                      findName={},
//                      findAbbr={};
//                      dict.forEach((d)=>{findAbbr[d.State]=d.Abbreviation,findName[d.Abbreviation]=d.State;});  
//
//                const row={},
//                      col={};
//                      grid.forEach((d)=>{row[d.state]=d.row,col[d.state]=d.col})
//
//                const gridWidth=d3.max(grid,(d)=>{return d.col})+1,
//                      gridHeight=d3.max(grid,(d)=>{return d.row})+1;
//
//                function sortByDateAscending(a, b) {
//                    return a.index - b.index;
//                }    
//
//                //add two new arritutes to each nest object
//                nest.forEach((d,i)=>{
//                      d.abbr=findAbbr[d.key]
//                      d.row=row[d.abbr]
//                      d.col=col[d.abbr]
//                      d.values.forEach( 
//                          (n,e)=>{ 
//                          if (e==15){  n.index=0}
//                          else { n.index=e+1}
//                          }     
//                      )
//                      d.values.sort(sortByDateAscending);      
//                })        
//            })
//       
//}






//draw small multiples function
 function draw (d){
            
    
 const gridWidth = d3.max(d, function(d) { return d.col; }) + 1,
       gridHeight = d3.max(d, function(d) { return d.row; }) + 1;
     
 const state = svg.append("g").attr("class","plot")
                  .attr("transform", "translate(" + width /2 + "," + height /2 + ")")
                  .selectAll(".state")
                  .data(d)
                  .enter().append("g").attr("class", "state").attr("id",(d)=>{return d.abbr})
                  .attr("transform", (d)=> { 
         return "translate(" + (d.col - gridWidth / 2) * stateWidth + "," + (d.row - gridHeight / 2) * stateWidth + ")"; });

    
 //append "rect" to each "g"
 const rects=state.append("rect").attr("width", stateWidth-gap)
                  .attr("height", stateWidth-gap).attr("x",-stateWidth/2).attr("y",-stateWidth/2);
    
 //append text to each g
 const text=state.append("text").text((d)=>{return d.abbr}).style("opacity",.3)
                  .attr("transform", "translate("+-stateWidth/3+","+-stateWidth/4+")" );
               
 //compute the min and max for x and y
 x.domain(d[0].values.map(function(d) { return d.income; }));
 //the Y scale for the states are the same   
 // const yMax=d3.max(income,(d)=>{return d.percent});   
 const yMax=0.3
 y.domain([0, yMax]);
  
 //append bar graghs to each rects
 const bars=state.append("g").attr("class","barChart")
                 .attr("transform", "translate("+-stateWidth/2+","+-stateWidth/2+")" );
    
 //COLOR MAP 
 var range=d[0].values.map(function(d) { return d.income; });
     
       bars.selectAll(".bars")
           .data((d)=>{return d.values }).enter().append("rect")
                .attr("x", (d) => { return x(d.income); })
                .attr("y", (d) => { return y(d.percent); })
                .attr("width", x.bandwidth())
                .attr("height", (d) => { return barChartWidth- y(d.percent); })
                .style("fill",(d)=>{ return color(d.index)})
                .style("stroke","none") 
 }




//
//function parseData(d){
//      
//    return {
//        year: +d.Year,
//        income: d.Income,
//        state: d.State,
//        percent: +d.Percent,
//        household: parseFloat(d.Households.replace(",", ""))
//        
//    };
//}
