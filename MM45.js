// import {json} from 'd3';


const width = document.getElementById('viz').clientWidth;
// console.log(width)
const height = document.getElementById('viz').clientHeight;;
console.log(height)
const radius = width/3
let data = []
const primary = '#132743'
const secondary = '#d7385e'



const margin = {top: 50, right: 100, bottom: 80, left: 100}

const outerRadius = Math.min(width, height) / 2.3;

let innerRadius = Math.min(width, height) * 0.5 - 180
let metric = 'Internet users'

let x,y,rScale,selectedCountry,projection

const numberFormat = d3.format(".1%")


const svg = d3.select('body')
.select('.viz')
.append('svg')
   svg.attr('width', width + margin.left + margin.right)
   .attr('height', height + margin.top + margin.bottom)
  
   const g = svg.append('g')
   .attr("transform", "translate(" + (width/2.3 + margin.left) + "," + (height/2 + margin.top) + ")");


 
const internetBtn = document.getElementById('int')
internetBtn.addEventListener('click', () => internet())

const internetGapBtn = document.getElementById('int-gap')
internetGapBtn.addEventListener('click', () => internetGap())

const mobileGapBtn = document.getElementById('mobile-gap')
mobileGapBtn.addEventListener('click', () => mobileGap())

const sortBtn = document.getElementById('sort')
sortBtn.addEventListener('click', () => sort())




const changeDescription = (desc) => {
  const description = d3.select('.description')

  description
  .transition().duration(800)
  .style('opacity', 0)
  .transition().duration(800)
  .text(desc)
  .style('opacity', 1)
}

const createLegend = () => {


  const legend = d3.select('.legend')

  legend.append("circle").attr("cx",16).attr("cy",25).attr("r", 10).style("fill", primary)
  legend.append("circle").attr("cx",16).attr("cy",55).attr("r", 10).style("fill", secondary)
  legend.append("text").attr("x", 36).attr("y", 25).text("Male access exceeds female access").style("font-size", "12px").attr("alignment-baseline","middle")
  legend.append("text").attr("x", 36).attr("y", 55).text("Female access exceeds male access").style("font-size", "12px").attr("alignment-baseline","middle")
}

createLegend()



 
const internetGap = () => {
  metric = "Gender gap in internet access"
  const description = `The indicator measures gap between female and male access to the internet. `

  d3.select('.legend')
  .transition().duration(500)
  .style('opacity', '1')

  d3.selectAll('.active').classed('active', false)
  internetGapBtn.classList.add('active')
  

  y.domain([0.0000001, d3.max(data, d => Math.abs(d[metric]))])
  rScale.domain([0,d3.max(data, d => Math.abs(d[metric]))])

  createBars()
  createDots()
  createPaths()
  createLabels()
  changeDescription(description)

}

const internet = () => {
  metric = "Internet users"

  const desc = 'The percentage of households with internet access at home. Access may be via a computer, but can also include mobile phones, digital TVs etc.'

  
  d3.select('.legend')
  .transition().duration(500)
  .style('opacity', '0')

  d3.selectAll('.active').classed('active', false)
  internetBtn.classList.add('active')
  

  y.domain([0.0000001, d3.max(data, d => Math.abs(d[metric]))])
  rScale.domain([0,d3.max(data, d => Math.abs(d[metric]))])

  createBars()
  createDots()
  createPaths()
  createLabels()
  changeDescription(desc)

}

const mobileGap = () => {
  metric = "Gender gap in mobile phone access"
  const desc = "The gap between female and male access to mobile phones."

  y.domain([0.0000001, d3.max(data, d => Math.abs(d[metric]))])
  rScale.domain([0,d3.max(data, d => Math.abs(d[metric]))])

  d3.select('.legend')
  .transition().duration(500)
  .style('opacity', '1')

  createBars()
  createDots()
  createPaths()
  createLabels()
  changeDescription(desc)

  d3.selectAll('.active').classed('active', false)
  mobileGapBtn.classList.add('active')


}

const sort = () => {
  
  data.sort((a,b) => d3.descending(Math.abs(a[metric]), Math.abs(b[metric])))

   x.domain(data.map(d => d.Country))

  createBars()
  createDots()
  createPaths()
  createLabels()

}







const createBars = () => {


 

  const arc = d3.arc()     // imagine your doing a part of a donut plot
  .innerRadius(innerRadius)
  .outerRadius(d =>  y(Math.abs(d[metric])))
  .startAngle(d => x(d.Country))
  .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
  .padAngle(0.02)
  .padRadius(360)

  g.selectAll(".bars")
  .data(data, d => (d.Country))  
  .join(enter =>     
    enter.append('path')
    // .attr("fill", d => d[metric] > 0 ? '#00C7C4' : '#215f')
    .attr("fill", d => d[metric] > 0 ? primary : secondary)
    .classed('bars', true)
    .attr('d', d3.arc()     // imagine your doing a part of a donut plot
    .innerRadius(innerRadius)
    .outerRadius(function(d) { return y(0.01); })
    .startAngle(function(d) { return x(d.Country); })
    .endAngle(function(d) { return x(d.Country) + x.bandwidth(); })
    .padAngle(0.01)
    .padRadius(innerRadius))
    .on('mouseover', function() {
      let name = d3.select(this).datum().Country
      // console.log(name)

      
      d3.selectAll('.bars')
      .attr('opacity', 1)
      .filter(d => d.Country != name)
      .transition('hover_bars').duration(400)
      .attr('opacity', 0.2)

      d3.selectAll('.bar_lables')
      .attr('opacity', 1)
      .filter(d => d.Country != name)
      .attr('opacity', 0.2)

      d3.selectAll('.dots')
      .attr('opacity', 1)
      .filter(d => d.properties.name != name)
      // .transition('hover').duration(400)
      // .attr('fill', 'gray')
      .attr('opacity', 0.1)

      d3.selectAll('.link')
      .attr("stroke-opacity", 0.1)
      .filter(d => d.Country === name)
      // .transition('hover').duration(400)
      .attr("stroke-width", '5px')
      // .attr('fill', 'gray')
      .attr("stroke-opacity", 0.9)


    })
    .on('mouseout', function() {
      let name = d3.select(this).datum().Country
      // console.log(name)

      // I need to intereptu otherwise it would break transition
      d3.selectAll('.bars').interrupt('hover_bars')
     
      
      
      d3.selectAll('.bars')
      .attr('opacity', 1)
      
      d3.selectAll('.bar_lables')
      .attr('opacity', 1)

      d3.selectAll('.link')
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", '2px')

      d3.selectAll('.dots')
      .attr('opacity', 0.5)
      
     


    })
    
    
    .call(enter => enter
    .transition().duration(800).delay((d,i) => i*50)
    .ease(d3.easePoly)
    .attr("d", d => arc(d))    
   
    ),
  update => update
  
    .call(update => update.transition().duration(800).delay((d,i) => i*50)
    .ease(d3.easePoly)
    .attr("d", d => arc(d))   
    .attr("fill", d => d[metric] > 0 ? primary : secondary)
    )
    ,    
    exit => exit
    .call(exit => exit.transition()
    .duration(750)
    .delay((d,i) => i*10)
    .ease(d3.easeCircle)
    .style('fill', "#C20000") 
  .remove()
  ))
  
}

const createDots = () => {

g.selectAll(".dots")
.data(selectedCountry, d => d.id)
.join(enter => enter
.append("circle")
.classed('dots', true)
.attr("transform",function(d){                 
  let p = projection(d3.geoCentroid(d))
  // console.log(p) 
  
  //<-- centroid is the center of the path, projection maps it to pixel positions
  return "translate("+p+")";
})
.attr('r', 1)
.on('mouseover', function() {
  let name = d3.select(this).datum().properties.name
  // console.log(name)

  
  d3.selectAll('.bars')
  .attr('opacity', 1)
  .filter(d => d.Country != name)
  .transition('hover_bars').duration(400)
  .attr('opacity', 0.2)

  d3.selectAll('.dots')
  .attr('opacity', 1)
  .filter(d => d.properties.name != name)
  // .transition('hover').duration(400)
  // .attr('fill', 'gray')
  .attr('opacity', 0.1)

  d3.selectAll('.link')
  .attr("stroke-opacity", 0.1)
  .filter(d => d.Country === name)
  // .transition('hover').duration(400)
  .attr("stroke-width", '5px')
  // .attr('fill', 'gray')
  .attr("stroke-opacity", 0.9)


})
.on('mouseout', function() {
  let name = d3.select(this).datum().Country
  // console.log(name)

  // I need to intereptu otherwise it would break transition
  d3.selectAll('.bars').interrupt('hover_bars')
  
  
  d3.selectAll('.bars')
  .attr('opacity', 1)

  d3.selectAll('.link')
  .attr("stroke-opacity", 0.2)
  .attr("stroke-width", '2px')

  d3.selectAll('.dots')
  .attr('opacity', 0.5)
  
 


})
.call(enter => enter.transition().duration(800)

// .text(d => d.properties.name)
.attr('opacity', 0.5)
.attr('stroke', 'white')
.attr("r",d => {

  d.internet = data.filter(e => (d.properties.name) === e.Country)[0][metric]
 
  return rScale(d.internet)

})
.attr("fill",d => {   
  return d.internet > 0 ? primary : secondary

})

)
,update => update.call(update => update.transition().duration(800)

.attr("r",d => {

  d.internet = data.filter(e => (d.properties.name) === e.Country)[0][metric]
  return rScale(Math.abs(d.internet))

})
.attr("fill", d => d.internet > 0 ? primary : secondary)
)
)


}


const createPaths = () => {

  const link = d3.linkRadial()
  .angle(d => (d[0]))
  .radius(d => (d[1]))
  
  
  const radial = d3.lineRadial()
  .angle(d => (d[0]))
  .radius(d => (d[1]))
  .curve(d3.curveCatmullRomClosed)
  
  
  const radialD = data.map((d,i) => {
  
    let point = selectedCountry.filter(e => {
      return e.properties.name === d.Country})
  
    let centroids = projection(d3.geoCentroid(point[0]))
    
  
    let pointRadial = d3.pointRadial(centroids[0], centroids[1])
  
    
  
    const toRadians =  (deg) => {
      return deg * (Math.PI / 180);
  };

  const r = Math.sqrt((Math.pow(centroids[0],2) + Math.pow(centroids[1],2)))
  
  
  const angel =  Math.atan2(centroids[0],-centroids[1])
  
  //tutaj działa jak jest x,y a nie tak jak mowia y/x
  
  // Jeżeli chcemy przekonwertować z radians na degrees to wtedy mnozymy 180/PI gdy chcemy zrobić w druga stornę to mnozmy przez PI/180
  // const angel =  180/Math.PI * Math.atan2(80,-80)  
  
  
  
       
      const newData = {  
        ...d,
   
    source: [angel ? angel: null , r ? r: null],

    target: [x(d.Country) + x.bandwidth()/2, y(0.002)],

    }
  
    return newData
  })

  
  //Adding the link paths
  g.selectAll(".link")
  .data(radialD, d => d.Country)
  .join(enter => enter.append('path')
  .attr("stroke-opacity", 0.9)
  .attr("stroke-width", '5px')
  .attr('fill', 'none')
  .classed("link", true)
  .attr("d", d => link({source: d.source, target: d.source}))
  .call(enter => enter.transition().duration(1000)
  .ease(d3.easePoly)    
  .attr("d", d => link(d))  
  .attr("stroke-opacity", 0.6)
  

  
  .attr("stroke", d => d[metric] > 0 ? primary : secondary)
  .attr("stroke-width", '2px')
  .attr('fill', 'none')
  .attr("stroke-opacity", 0.2)
  
  ),
  update => update.call(update => update.transition().duration(2000) 
  .ease(d3.easePoly)
  .attr("d", d => link({source: d.source, target: d.source}))
  .transition().duration(1000).delay((d,i) => i*10)
  .attr("stroke", d => d[metric] > 0 ? primary : secondary)
  .attr("stroke-width", `2px`)
  .attr("d", d => link(d))
  )
  )
  
  }



const createLabels = () => {

  function textTween(a, b) {
    const i = d3.interpolateNumber(a, b);
    return function(t) {
      this.textContent = numberFormat(i(t));
    };
  }

  g.selectAll('.bar_lables')
  .data(data, d => d.Country)
  .join(enter =>
    enter.append('text')
    .classed('bar_lables', true)
    .property("_current", d => d[metric])
    .attr("text-anchor", d => (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
        .attr("transform", d => `
          rotate(${((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${y(Math.abs(d[metric])) + 10},0)
        `)    
  .attr('opacity', 0)
  .attr("transform", d => `
    rotate(${((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
    translate(${y(Math.abs(d[metric])) + 10},0)
    ${(x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2*Math.PI) < Math.PI
     ? "rotate(180)translate(0,4)"
     : "rotate(0)translate(0,4)"}
    `)
.call(enter => enter.transition().duration(800).delay((d,i) => i*50)
  .attr('font-size', '12px')
  .attr("fill", d => d[metric] > 0 ? primary : secondary)
  .text(d => `${d.Country}, ${numberFormat(Math.abs(d[metric]))} `)
  
  .attr('opacity', 1)
  )
  , update => update.call(update => update.transition().duration(800).delay((d,i) => i*50)
  // .each(d => d._current = d[metric])
  .attr("text-anchor", d => (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start")
        .attr("transform", d => `
          rotate(${((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${y(Math.abs(d[metric])) + 10},0)
        `)    
  .attr("transform", d => `
  rotate(${((x(d.Country) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
  translate(${y(Math.abs(d[metric])) + 10},0)
  ${(x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2*Math.PI) < Math.PI
   ? "rotate(180)translate(0,4)"
   : "rotate(0)translate(0,4)"}
  `).attr("fill", d => d[metric] > 0 ? primary : secondary)
  .textTween(function(d) {
    let current = (this._current)
    let text = this.textContent;
    let i = d3.interpolateNumber(current, (Math.abs(d[metric])))

    this._current = d[metric]
   

    return function(t) {
      return (this.textContent= `${d.Country}, ${numberFormat(i(t))}`)
    }

    


  })    
  )
  
  
  

  )


}


const myData = async () => {

    try {

    data =  await d3.dsv(';','./data/MM45.csv',d3.autoType)   
    let worldMap = await d3.json("./data/custom.geo.json")

    
    


   const groupData = d3.group(data, d => d.Country)



   selectedCountry = worldMap.features.filter(d => groupData.has(d.properties.name))



 

  


   projection = d3.geoMercator()
  //  .center([40,-65])                // GPS of location to zoom on
   .scale(75)                       // This is like the zoom
   .translate([ -10, 70 ])
   
  const path =  d3.geoPath()
  .projection(projection);
  

  
  x = d3.scaleBand().range([0,2*Math.PI])
  .align(0)
  .domain(data.map(d => d.Country))

  y = d3.scaleRadial()
  .domain([0.0000001, d3.max(data, d => Math.abs(d[metric]))])
  .range([innerRadius, outerRadius])

  


   rScale = d3.scaleLinear()
   .domain([0,d3.max(data, d => Math.abs(d[metric]))])
   .range([4,12])







  // const angleSlice = Math.PI * 2 / groupData.size;

  let p = selectedCountry.map(d => projection(d3.geoCentroid(d)))
  // console.log(p)


  // Code to create map. I remove antarctica and show dots only for matched data 

  



   g
   .selectAll(".map")
   .data(worldMap.features.filter(d => (d.properties.name)!='Antarctica'))
   .enter().append("path")
      .classed('map', true)
      //  .attr("fill", "#2e2e2e")
       .attr("fill", "#edc988")
       .attr("d", path)       
       .style("stroke", "#f8efd4")


  //      const zoomed = (event) => {
  //       const {transform} = event;
  //       g.selectAll('.map').attr("transform", transform);
  //       g.attr("stroke-width", 1 / transform.k);
  //     }
    

  //      const zoom = d3.zoom()
  //      .scaleExtent([1, 8])
  //      .on('zoom', zoomed)
  //      ;


  // svg.call(zoom)


  createDots()
  
  // Create bars with arc 


  

  createBars()
  createLabels()

 







  // Bar chart with diffrent techince

// 



// Create paths



  createPaths()



   
    }
    catch (e) {
        console.log(e)
    }
}




// GSAP animation

gsap.from(".title", {duration: 2, opacity: 0, y: 50, ease:'slow', onComplete: myData});

