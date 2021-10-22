const numbers = [20,20,30,40,50]
let sum = 0
function calculateMean(x){
    for (let i=0; i<x.length;i++){
    sum += x[i]
    }
    console.log(sum/x.length)
}
calculateMean(numbers)