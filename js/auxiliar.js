$(document).ready(function () {

  $("#open-menu").on('click', function() {
    $(".side-menu-form").css("width", "250px");
    $(".side-menu-form").css("padding", "10px 10px");

  });

  $("#side-menu-close-btn").on('click', function() {
    $(".side-menu-form").css("width", "0px");
    $(".side-menu-form").css("padding", "0px");
  });

    $("#submit").on('click', function() {
	    $(".side-menu-form").css("width", "0px");
	    $(".side-menu-form").css("padding", "0px");
  });
});