$(document).ready(function () {
    
    var images = ["./assets//images/image1.jpg", "./assets/images/image2.jpg",
        "./assets//images/image3.jpg", "./assets//images/image4.jpg",
        "./assets//images/image5.jpg",
        "./assets//images/image6.jpg", "./assets//images/image7.jpg", "./assets//images/image8.jpg", "./assets//images/image9.jpg"
    ];

    var showImage;
    var count = 1;

    startSlideshow();

    function startSlideshow() {

        // Use showImage to hold the setInterval to run nextImage.
        showImage = setInterval(nextImage, 5000);

    }

    function nextImage() {

        console.log("In nextimage " + count);
        // Use a setTimeout to run displayImage
        setTimeout(displayImage, 5000);

        // Increment count
        count++;
        if (count === images.length) {
            count = 0;
        }
    }

    // This function will replace display whatever image it's given
    // in the 'src' attribute of the img tag.
    function displayImage() {
        console.log("In displayImage " + count);

        $("body").css('background-image', 'url("' + images[count] + '")');
    }


    //localStorage
    $("#submit").on("click", function (event) {
        event.preventDefault();
        console.log('function');
        var password = $("#password").val().trim();
        var email = $("#email").val().trim();

        console.log(password);
        console.log(email);

        //clear localStorage
        localStorage.clear();

        localStorage.setItem("password", password);
        localStorage.setItem("email", email);

        // Replace login screen with main app window
        window.location.replace("./main.html")
    

    });

});