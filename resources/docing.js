// #DocIng
// 
// Auto generate documents for your codes. Any language and any format can be covered by DocIng.
// 
// **Author**: DanielZhu(enterzhu@gmail.com)
// **Datae**: 2014/07/19
// 
// Copyright 2014. Zhu Meng Dan

$(document).ready(function(){

  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 800);
        return false;
      }
    }
  });

// {id:11,text:"11",icon:,children:[],li_attr:[],a_attr:[],state:{opened:false,disabled:false,selected:false}}

  $('#jstree').jstree({ 'core' : {
    'data' : [
       'Simple root node',
        {id:11,text:"11",icon: "",children:[],li_attr:[],a_attr:[], state:{opened:false,disabled:false,selected:false}},
       {
         'text' : 'Root node 2',
         'state' : {
           'opened' : true,
           'selected' : true
         },
         'children' : [
           { 'text' : 'Child 1' },
           'Child 2'
         ]
      }
    ]
} });
 
  $("#handler-vertical").resizable({});

  $("#handler-vertical").on('resize', function(event) {
    var commentWidth = event.clientX;
    console.log(commentWidth);
    if (commentWidth / window.innerWidth >= 0.2 && (commentWidth) / window.innerWidth <= 0.8) {
      $(".background").width(event.clientX);
      $(".comment").width(event.clientX - 40);
      $(".code").css('margin-left', event.clientX);
      console.log( "<div>Handler for .resize() called.</div>" );
    }
  });

  $('ul > li').hover(
    function(event) {
      $('.comment-anchor').fadeIn('200');
      $('.code-anchor').fadeIn('200');
      highlightMouseHover(event);
    },
    function(event) {
      $('.comment-anchor').fadeOut('200');
      $('.code-anchor').fadeOut('200');
      highlightMouseHover(event);
    }
  );

  function highlightMouseHover(event) {
    var children = event.currentTarget.parentElement.children;

    for (var i = 0; i < children.length; i++) {
      $(event.currentTarget.parentElement.children[i]).toggleClass('highlight-text');
    };
  }
});