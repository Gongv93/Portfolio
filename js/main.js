$(document).ready(function()
{

    // Add smooth scroll to all links
    $("a").on('click', function(event) {
        // Prevent default behavior 
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        $(".active").removeClass("active");
        $(this).addClass("active");

        // Scroll for 8ms to the specified location
        $('html, body').animate({
            scrollTop: $(hash).offset().top
        }, 500, function() {
            // Set the new hash location
            window.location.hash = hash;
        });
    });
});