console.log("a")
setTimeout(()=>{
console.log("b")
},0)
Promise.then(()=>{
    console.log("c")
})
console.log("d")