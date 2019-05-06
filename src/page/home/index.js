import './index.less'

initBannerSwiper();
function initBannerSwiper(){
  let s = new Swiper("#home-banner-swiper", {
    loop : true,
    autoplay:5000,
    speed:500,
    pagination: '#home-banner-swiper .swiper-pagination',
  })
}

initBlockText();
function initBlockText(){
  let s = new Swiper("#swiper-block-text", {
    loop : true,
    prevButton: '.comment-block-text .swiper-button-prev',
    nextButton: '.comment-block-text .swiper-button-next',
  })
}


$(".form input").focus(function(){
  $(this).parent().addClass("active");
}).blur(function(){
  $(this).parent().removeClass("active");
});
