import "../products.less";

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
  let id = $(this).attr("data-id");
  let text = $(this).attr("data-text");
  let link = $(this).attr("data-link");
  let json = {id,text,link};
  let isEsit = compare.some(item=>item.id == id);
  if(isEsit) return;
  compare.push(json);
   localStorage.setItem("compare",JSON.stringify(compare));
   updateCompareProducts(compare);
  return false;
});

//删除
$(document).on("click",".delete",function(){
let compare = JSON.parse(localStorage.getItem("compare"));
compare = compare.filter(item=>item.id != this.id);
localStorage.setItem("compare",JSON.stringify(compare));
$(this).parent(".compare-item").remove();
})

$(document).on("click",".clear-all",function(){
localStorage.setItem("compare","[]");
$("#compare-items").html("");
$(".compare-content").css("display","none");
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
              <a href="javascript:;" title="Remove This Item" id="${id}" class="delete"></a>
        </li>`
    )
  });
  let strHtml = html.join("")+"";
  $("#compare-items").html(strHtml)
}





//
