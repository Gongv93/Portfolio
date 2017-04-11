var MAX_COL = 3;    // Max number of columns per row for projects

$(document).ready(function()
{
    // Load the main content to the page
    // 
    $("#main").load("main.html", function() {
       // Get git hub repo information and create links to them
       $.getJSON("https://api.github.com/users/Gongv93/starred", createProjectTiles);
    });

    // This function takes the git information and creates our project tiles to display
    // 
    function createProjectTiles(gitInfo) {
        var template = $("#projTemplate").html();    // Template for git details
        var n = Math.ceil(gitInfo.length / MAX_COL); // Round up to get the correct number of rows

        // Exit early if size is 0
        if(gitInfo.length == 0) return;
        
        // Remove the error message
        $("#projects").find(".container-fluid").find("#error").remove();

        // Create the currect numer of rows
        for(i=0; i<n; ++i) {
            $("#projects").find(".container-fluid").append("<div id=\"" + i + "\" "+ "class=\"row\"></div>");

            // Make sure we make MAX_COL amount per row
            for(j=0; j<MAX_COL; ++j) {
                var infoIndex = i*MAX_COL + j; 

                // Return if we reached past the last element
                if(infoIndex >= gitInfo.length) return;
            
                // Fill in the template and append it to the current row element
                var currentGitInfo = gitInfo[infoIndex];

                // Get thumbnail pic from first line of each readme
                var thumbnailLink = "https://s-media-cache-ak0.pinimg.com/originals/6c/28/2a/6c282a66c8955eb7517b0f0e3780f5a5.jpg"
                $.ajax({url: currentGitInfo.url + "/readme", async: false,success: function(data) {
                    $.ajax({url: data.download_url, async: false, success: function(result) {
                        result = result.split('\n')[0];

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
                
                $("#projects").find(".container-fluid").find("#" + i).append(rendered);
            }
        }
    }

    // Add smooth scroll to all links
    // 
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