"use strict";
console.log('productPage script loaded...'); 
let prodArr = JSON.parse(products);

prodArr.forEach((product)=>{
    console.log(product.startTime, typeof product.startTime)
});