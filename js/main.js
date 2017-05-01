var MAX_COL          = 3;         // Max number of columns per row for projects
var GIT_ID           = 5107486;   // Git user ID
var SCROLL_TIME      = 400;       // Animation time for scrolling

$(document).ready(function()
{
/**********************************************
 *                  Listeners
 **********************************************/
    // Load the main content to the page
    // 
    $("#main").load("main.html", function() {
       // Initialize the selected nav menu
       var selectOffset = $("li").first().offset().top;
       $("#active").css('top', selectOffset)
       $("li").first().addClass("active2");

       // Get git hub repo information and create links to them
       $.getJSON("https://api.github.com/users/Gongv93/starred", createProjectTiles);
    });

    // Add smooth scroll to all links
    // 
    $("nav a").click(function(event) {
        // Prevent default behavior 
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        $(".active2").removeClass("active2");
        $(this).addClass("active2");

        // Scroll for 8ms to the specified location
        $('html, body').animate({
             scrollTop: $(hash).offset().top
        }, { duration: SCROLL_TIME, 
             queue: false, 
             complete: function() {
                window.location.hash = hash;    // Set the new hash location
            }
        });
    });

    // Scroll listener
    //
    $(window).scroll(function () {
        checkAnimation();
        updateNav();
    });

    // Toggle button for showing nav
    //
    $("#toggleNav").click(function() {
        $("#sidebar").toggleClass("toggle toggleOff");
        $("#main").toggleClass("toggle toggleOff");
        $("#toggleNav").toggleClass("toggle toggleOff");
        $("#footer").toggleClass("toggle toggleOff");
    });

/**********************************************
 *                  Functions 
 **********************************************/
    // This function takes the git information and creates our project tiles to display
    // 
    function createProjectTiles(gitInfo) {
        var template = $("#projTemplate").html();    // Template for git details
        var projCount = 0;
        var rowCount  = 0;

        // Exit early if size is 0
        if(gitInfo.length == 0) 
            return;
        
        // Remove the error message
        $("#projects").find(".container").find("#error").remove();

        // Create the currect numer of rows
        for(i=0; i<gitInfo.length; ++i) {
            // Fill in the template and append it to the current row element
            var currentGitInfo = gitInfo[i];

            // Check to see if this repo belongs to me
            if(currentGitInfo.owner.id != GIT_ID)
                continue;

            // Create a new row everytime a row has been filled
            if(projCount++ % MAX_COL == 0) {
                rowCount++;
                $("#projects").find(".container").append("<div id=\"" + rowCount + "\" "+ "class=\"row\"></div>");
            }

            // Get thumbnail pic from first line of each readme
            var thumbnailLink = "https://s-media-cache-ak0.pinimg.com/originals/6c/28/2a/6c282a66c8955eb7517b0f0e3780f5a5.jpg"
            $.ajax({url: currentGitInfo.url + "/readme", async: false, success: function(data) {
                $.ajax({url: data.download_url, async: false, success: function(result) {
                    result = result.split('\n')[0];

                    // Verify that the first line is a link
                    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                    if(regexp.test(result)) {
                        thumbnailLink = result;
                    }
                }});    
            }});

            // Fill in template
            var view = { name:        currentGitInfo.name,
                         link:        currentGitInfo.html_url,
                         image:       thumbnailLink,
                         fullname:    currentGitInfo.full_name,
                         description: currentGitInfo.description};
            var rendered = Mustache.render(template, view);
            
            $("#projects").find(".container").find("#" + rowCount).append(rendered);
        }
    }

    // This function updates the nav when the user scrolls
    //
    function updateNav() {
        var threshold_line = 50;   // Number of pixel from the top before selection gets updated

        // Check to see where we need to update 
        $('section').each(function () {
            var thisTop = $(this).offset().top - $(window).scrollTop();

            // If our line is between a section then we update
            // the nav bar with the new selection
            if (threshold_line > thisTop && 
               (threshold_line < thisTop + $(this).height())) 
            {
                // Get the element we have to update in the nav bar
                var newSelect = $("a[href=\""+ "#" + $(this).attr('id') + "\"]")[0];

                // Update the nav bar accordinly
                $(".active2").removeClass("active2");
                $(newSelect).addClass("active2");

                var viewportOffset = newSelect.getBoundingClientRect();

                $('#active').animate({
                     top: viewportOffset.top
                }, { duration: SCROLL_TIME, 
                     queue: false
                });
            }
        });
    }

    // Check if it's time to start the animation.
    //
    function checkAnimation() {
        for(i=0; i < $('.skillbar').length; ++i) {
            var $elem = $($('.skillbar')[i]);

            // If the animation has already been started
            if ($elem.hasClass('start')) continue;

            if (isElementInViewport($elem)) {
                var percent = $elem.attr('data-percent');
                $elem.find('.skillbar-bar').animate({
                    width: percent
                },{ duration: 6000, 
                    queue: false
                });

                // Start the animation
                $elem.addClass('start');
            }
        }
    }

    // Returns true if the specified element has been scrolled into the viewport.
    //
    function isElementInViewport(elem) {
        var $elem = $(elem);

        // Get the scroll position of the page.
        var scrollElem = ((navigator.userAgent.toLowerCase().indexOf('webkit') != -1) ? 'body' : 'html');
        var viewportTop = $(scrollElem).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        // Get the position of the element on the page.
        var elemTop = Math.round( $elem.offset().top );
        var elemBottom = elemTop + $elem.height();

        return ((elemTop < viewportBottom) && (elemBottom > viewportTop));
    }
});