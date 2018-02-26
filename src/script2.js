const fs = require('fs');
const d3 = require("d3");
const csv = require('csv-parse');
let pathGrid="/Users/KiniLuo/Desktop/d3Blocks-repo/D3-Map-Small-Multiple/data/stateGrid.json",
    pathIncome="/Users/KiniLuo/Desktop/d3Blocks-repo/D3-Map-Small-Multiple/data/income.json",
    pathDict="/Users/KiniLuo/Desktop/d3Blocks-repo/D3-Map-Small-Multiple/data/dict.json"

//load grid
let rawGrid = fs.readFileSync(pathGrid);  
let grid = JSON.parse(rawGrid);  

//load dict
let rawDict = fs.readFileSync(pathDict);
let dict = JSON.parse(rawDict);
//console.log("dict",dict);  


//load income
let rawIncome = fs.readFileSync(pathIncome);
let incomeBeforeParse = JSON.parse(rawIncome);
let income=[];


incomeBeforeParse.forEach((d,i)=>{   
    income.push({
        
        year: +d.Year,
        income: d.Income,
        state: d.State,
        percent: +d.Percent,
        household: parseFloat(d.Households)
            
    })    
})

//console.log(income);


const nestByYear=d3.nest().key((d)=>{return d.year}).key((d)=>{return d.state}).entries(income);
nestByYear.forEach((m,j)=>{

                const nest=m.values,
                      findName={},
                      findAbbr={};
                      dict.forEach((d)=>{findAbbr[d.State]=d.Abbreviation,findName[d.Abbreviation]=d.State;});  

                const row={},
                      col={};
                      grid.forEach((d)=>{row[d.state]=d.row,col[d.state]=d.col})

                const gridWidth=d3.max(grid,(d)=>{return d.col})+1,
                      gridHeight=d3.max(grid,(d)=>{return d.row})+1;

                function sortByDateAscending(a, b) {
                    return a.index - b.index;
                }    

                //add two new arritutes to each nest object
                nest.forEach((d,i)=>{
                      d.abbr=findAbbr[d.key]
                      d.row=row[d.abbr]
                      d.col=col[d.abbr]
                      d.values.forEach( 
                          (n,e)=>{ 
                          if (e==15){  n.index=0}
                          else { n.index=e+1}
                          }     
                      )
                      d.values.sort(sortByDateAscending);      
                })        
            })


console.log("nest",nestByYear[0].values[0].values);


let data = JSON.stringify(nestByYear);  
fs.writeFileSync('/Users/KiniLuo/Desktop/d3Blocks-repo/D3-Map-Small-Multiple/data/data.json', data);  