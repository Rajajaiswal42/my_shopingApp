const deleteProduct=(btn)=>{
  const prodid=  btn.parentNode.querySelector('[name=productid]').value
   const csrf= btn.parentNode.querySelector('[name=_csrf]').value
   const productElement=btn.closest('article')
  //console.log(productElement)
  fetch('/admin/product/'+ prodid,{
    method:'DELETE',
    headers:{
       'csrf-token':csrf
    }
  }).then(data=>{
       return data.json()
  }).then(result=>{
    console.log(result)
    productElement.parentNode.removeChild(productElement)
  })
  .catch(err=>console.log(err))

}