import './products.less'

(()=>{
  if(!localStorage.getItem("compare")){
    localStorage.setItem("compare",'[]')
  }
  let compare = JSON.parse(localStorage.getItem("compare"));
  updateCompareProducts(compare);
})();


//添加
$(".compare-btn").click(function(){
  let compare;
  if(!localStorage.getItem("compare")){
    localStorage.setItem("compare",'[]')
  }else{
    compare = JSON.parse(localStorage.getItem("compare"));
  }
  let {id,text,link} = this.dataset;
  let json = {id,text,link};
  let isExist = compare.some(item=>item.id == id);
  if(isExist){
    // alert("已添加");
    return false;
  }
  compare.push(json);
   localStorage.setItem("compare",JSON.stringify(compare));
   updateCompareProducts(compare);
  return false;
});

//删除
$(document).on("click",".delete",function(){
  dialogAlert("Are you sure you want to remove this item from your Compare Products list?",this.id,"single");
  return false;
})

//删除所有
$(document).on("click",".clear-all",function(){
  dialogAlert("Are you sure you want to remove all items from your Compare Products list?",this.id,"all");
  return false;
})

//删除一个
$(document).on("click","#dialog-ok",function(){
  let type = this.dataset.type;
  if(type == "all"){
    localStorage.setItem("compare","[]");
    $("#compare-items").html("");
    $(".compare-content").css("display","none");
    hideDialog();
    return false;
  }
  let dataId = this.dataset.id;
  let compare = JSON.parse(localStorage.getItem("compare"));
  compare = compare.filter(item=>item.id != dataId);
  localStorage.setItem("compare",JSON.stringify(compare));
  updateCompareProducts(compare);
  hideDialog();
})



function updateCompareProducts(arr){
  if(arr.length!=0){
    $(".compare-content").css("display","block");
  }else{
    $(".compare-content").css("display","none");
  }
  let html = arr.map((item,index)=>{
    let {id,text,links} = item;
    return (
      `<li class="compare-item">
              <strong class="compare-item-name">
                <a class="compare-item-link" href="${links}">${text}</a>
              </strong>
              <a href="javascript:;" title="Remove This Item" id="${id}" class="delete glyphicon glyphicon-remove-circle"></a>
        </li>`
    )
  });
  let strHtml = html.join("")+"";
  $("#compare-items").html(strHtml)
}

















//
