(() => {
    console.log('bootstrap validation loaded')
  'use strict'

  var forms = document.querySelectorAll('.needs-validation')

  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        const isRatingSelected = ratingInput.value !== "";

        if (!form.checkValidity() || !isRatingSelected) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!isRatingSelected) {
          ratingInput.classList.add("is-invalid");
          ratingFeedback.style.display = "block";
        }
        form.classList.add('was-validated')
      }, false)
    })
})()