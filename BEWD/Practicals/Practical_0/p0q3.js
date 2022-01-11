let n = 12
var atable = []
function multiplicationTable(x){
    let q =1
    for (let a=0; a<x; a++){
        for(let i=1; i<=x;i++){
            atable.push((q)*i)
        }
        q++
    }
}
multiplicationTable(n)
console.dir(atable, {'maxArrayLength': null});
