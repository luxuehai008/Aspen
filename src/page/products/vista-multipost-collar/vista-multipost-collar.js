import './vista-multipost-collar.less'

let popIndex = 0;
let popImgSrc = [...$(".productThumbs a> img")].map(item => item.src);
initBannerSwiper();

loadingImg(popImgSrc,function(){
  $(".loading-slider").removeClass("loading-slider");
});


$(".accordion").click(function() {
  $(this).toggleClass("active");
  $(this).next().toggleClass("active");
});

//打开弹出框
$(".productThumbs li").click(function() {
  popIndex = $(this).index();
  openPopImg(popImgSrc[popIndex])
});
$("#swiper-products-slider .swiper-slide").click(function() {
  popIndex = parseInt($(this).attr("data-swiper-slide-index"));
  openPopImg(popImgSrc[popIndex])
});

$(document).on("click", ".slider-btn", function() {
  if (this.id == "prev") {
    popIndex-- <= 0 ? popIndex = popImgSrc.length - 1 : ""
  } else if (this.id == "next") {
    popIndex++ >= popImgSrc.length - 1 ? popIndex = 0 : ""
  }
  $(".sib-img").attr("src",popImgSrc[popIndex]);
  return false;
});
//关闭popImg
$(document).on("click", ".pop-slider-wrapper", function() {
  $("body").removeClass("has-dialog");
  $(".pop-slider-wrapper").remove();
});

//点击大图切换
$(document).on("click", ".sib-img", function() {
  popIndex++ >= popImgSrc.length - 1 ? popIndex = 0 : ""
  $(".sib-img").attr("src",popImgSrc[popIndex]);
  return false;
});

function initBannerSwiper() {
  let s = new Swiper("#swiper-products-slider", {
    loop: true,
    prevButton: '.products-slider-prev',
    nextButton: '.products-slider-next',
    pagination: '.products-slider-pagination'
  })
}




function openPopImg(src) {
  $("body").addClass("has-dialog");
  let strHtml = `<div class="pop-slider-wrapper">
      <div class="slider-btn products-slider-prev glyphicon-menu-left" id="prev"></div>
      <div class="slider-btn products-slider-next glyphicon-menu-right" id="next"></div>
      <div class="content-outer">
          <div class="img-warpper">
              <img class="sib-img" src="${src}" alt="">
            </div>
        </div>
  </div>`
  $("body").append(strHtml);
}
