const n = 15;

function bigBus(x){
    for (let i=1; i<=x; i++){
        if (i%3==0 && i%5!=0){
            console.log('Bus');
        }
        else if (i%5==0 && i%3!=0){
            console.log('Big');
        }
        else if (i%15==0){
            console.log('Bigbus');
        }
        else{
            console.log(i);
        }

    }
}
bigBus(n);