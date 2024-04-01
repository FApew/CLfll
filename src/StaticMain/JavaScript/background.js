//<script src="JavaScript/background.js"></script> in IndexStatic


document.addEventListener("DOMContentLoaded", function() {

    const arrImg = ["/src/StaticMain/img/Team19-20.png", "/src/StaticMain/img/Team21-22.png", "/src/StaticMain/img/Team22-23.png", "/src/StaticMain/img/Team23-24.png"]
    //style="background-image: url(img/Team21-22.jpg);""

    const background = document.getElementById("intro")

    let currentImg = 1

    function changeImg() {
        background.style.backgroundImage = `url(${arrImg[currentImg]})`
        currentImg = (currentImg + 1) % arrImg.length;
    }




    // Initial update
    changeImg()
    // Update background image every 3 seconds
    setInterval(changeImg, 5000)

})