$(function() {
  var currentBurger;

  function eatBurger(callback) {
    var audio = new Audio('/assets/Eating-SoundBible.com-1470347575.mp3');
    audio.play();
    setTimeout(callback, 2000);
  }

  $('[data-target="devour-burger-modal"]').on('click', function () {
    currentBurger = $(this).siblings('input').val();
    console.log(currentBurger);
  });

  $('#create-form').on('submit', function (event) {
    // Make sure to preventDefault on a submit event.
    event.preventDefault();

    var newBurger = {
      burger_name: $('#bu').val().trim(),
      isEaten: $('[name=group1]:checked').val().trim(),
    };

    // Send the POST request.
    $.ajax('/api/burgers/create', {
      type: 'POST',
      data: newBurger,
    }).then(function () {
      console.log('created new burger');
      // Reload the page to get the updated list
      location.reload();
    });
  });

  $('.devour-form').on('submit', function (event) {
    event.preventDefault();
    var burgerInfo = {
      burger_id: currentBurger,
      customer: $(this).children('.custom-input').val(),
    };

    console.log(burgerInfo);

    $.ajax({
      method: 'PUT',
      url: '/api/burgers/update',
      data: burgerInfo,
    }).then(function (data) {
      // reload page to display devoured burger in proper column
      eatBurger(function () {
        location.reload();
      });
    });
  });

  $(".delete-burger").on("click", function(event) {
    var id = $(this).data("id");

    // Send the DELETE request.
    $.ajax("/api/burgers/" + id, {
      type: "DELETE"
    }).then(
      function() {
        console.log("deleted burger", id);
        // Reload the page to get the updated list
        location.reload();
      }
    );
  });
});
