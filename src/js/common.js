import "../css/common.less";


/*common script start*/

let winW = $(document).width();



$(".header-search .label").click(function(event){
  $(this).siblings(".control").css("visibility","visible");
  return false;
});

$(".nav-content .level0").hover(function(){
$(this).children(".submenu-wrapper").addClass('over');
},function(){
$(this).children(".submenu-wrapper").removeClass('over');
});



$(".toggle-nav").click(function(event){
  $(this).addClass("nav-open")
  translateFn($(".page-nav"),0,0);
});


$(".nav-close").click(function(){
  translateFn($(".page-nav-wrapper"),0,0);
  translateFn($(".page-nav"),"-100%",0);
  $(".toggle-nav").removeClass("nav-open");
});

$(".page-nav-child .back").click(function(){
  translateFn($(".page-nav-wrapper"),0,0)
});
$(".page-nav-grandson .back").click(function(event){
  translateFn($(".page-nav-wrapper"),"-33.333%",0)
});

$(document).on("click",".nav-content li",function(){
  if(winW>=1024) return;
  let html = $(this).find(".submenu").eq(0).html();
  let text = $(this).children("a").find("span").text();
  if(!html) return;
  if($(this).hasClass("level0")){
    $(".page-nav-child .menu-nav-title").html(text)
    $(".page-nav-child .nav-content").html(html)
    translateFn($(".page-nav-wrapper"),"-33.333%",0)
  }else{
    $(".page-nav-grandson .menu-nav-title").html(text)
    $(".page-nav-grandson .nav-content").html(html)
    translateFn($(".page-nav-wrapper"),"-66.666%",0)
  }
})

function translateFn(ele,x,y){
  ele.css("transform",`translate(${x})`,y)
}

window.dialogAlert = function(artic,id,dataType){
  let text = artic || "Are you sure you want to remove this item from your Compare Products list?";
  let type = dataType || "single";
  let html = `<div class="dialog">
       <div class="dialog-inner-wrap">
          <div class="dialog-header">
            <button href="javascript:;" class="glyphicon glyphicon-remove dialog-close" onClick="hideDialog()"></button>
          </div>
          <div class="dialog-content"><div>${text}</div></div>
          <div class="dialog-footer">
              <button type="button" id="dialog-cancel" onClick="hideDialog()"><span>Cancel</span></button>
              <button type="button" id="dialog-ok" data-id="${id}" data-type="${type}"><span>OK</span></button>
            </div>
        </div>
      <div class="dialog-overlay"></div>
    </div>`
    $("body").addClass("has-dialog").append(html);
    let timer = setTimeout(()=>{
      $(".dialog-inner-wrap").addClass("show");
      clearTimeout(timer);
    },0);
}

window.hideDialog = function(){
  $(".dialog-inner-wrap").removeClass("show");
  let timer = setTimeout(()=>{
    $(".dialog").remove();
    clearTimeout(timer);
  },300);
}


window.loadingImg = function(imgSrc,cb){
  let step = 0;
  loader();
  function loader(){
    let img = new Image();
    img.src = imgSrc[step++];
    img.onload = function(){
      if(step>imgSrc.length-1){
        cb();
      }else{
        loader();
      }
    }
  }
}


// $(document).click(function(e){
//   $(".search .control").css("visibility","hidden");
//   return false;
// });
