
/*
 * 
 * JavaScript implementation of the fire effect from "doom-fire.com" using HTML Canvas element.
 * Author: Manos Veek
 * Last update: 07 Feb 2023
 * 
 * 
 * The fire effect can be configured with the following buttons:
 * 
 * - Spacebar or LMB : Enable or disable the fire source
 * - Up Arrow : Increase the value of the fire source
 * - Down Arrow : Decrease the value of the fire source
 * 
 */

const width = 320, height = 160, pixelSize = 6
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireWidth = width;
let fireHeight = height; 

let firePixelsArray = new Array().fill(0);
const numberOfPixels = width*height;

// Value that indicates if the fire source is alive
let burn = true;

// Define the frame rate
var frameRate = 27;
var interval = 1000 / frameRate;

// From white to black, with red, orange and yellow in between.
const fireColorsPalette = [
  "#070707",  "#1f0707",  "#2f0f07",  "#470f07",
  "#571707",  "#671f07",  "#771f07",  "#8f2707",
  "#9f2f07",  "#af3f07",  "#bf4707",  "#c74707",
  "#DF4F07",  "#DF5707",  "#DF5707",  "#D75F07",
  "#D7670F",  "#cf6f0f",  "#cf770f",  "#cf7f0f",
  "#CF8717",  "#C78717",  "#C78F17",  "#C7971F",
  "#BF9F1F",  "#BF9F1F",  "#BFA727",  "#BFA727",
  "#BFAF2F",  "#B7AF2F",  "#B7B72F",  "#B7B737",
  "#CFCF6F",  "#DFDF9F",  "#EFEFC7",  "#FFFFFF",
  ]

  function main() {

    // Begin with the fire source at its fullest
    createFireSource();

    // Repeat with the given interval
    setInterval(routine,interval);

}

// This function use "update" and "draw" function for each pixel.
function routine() {
    for (let column = 0; column < fireWidth; column++) {
        for (let row = 0; row < fireHeight; row++) {

            // Demonstrate 2D array index with 1D index
            const pixelIndex = column + (fireWidth * row);

            update(pixelIndex);

        }
    }

    draw()
}

// This function updates the current pixel's intensity number ( range is 0 - 35 )
function update(currentPixelIndex) {
    
    // Calculate the index of the pixel below the current one
    const belowPixelIndex = currentPixelIndex + fireWidth;

    // If the below pixel is outside of the canvas, return and do nothing
    if (belowPixelIndex >= fireWidth * fireHeight) {
        return;
    }

    // Determine the decay value (a random number between 0 and 1.3 rounded down)
    const decay = Math.floor((Math.random() * 1.3));
    
    // Get the fire intensity of the pixel below the current one
    const belowPixelFireIntensity = firePixelsArray[belowPixelIndex];
    
    // If the below pixel's fire intensity is 0, do not apply decay.
    // Otherwise, subtract the decay value from the below pixel's fire intensity.
    if (belowPixelFireIntensity - decay >= 0){
        newFireIntensity = belowPixelFireIntensity - decay;
    } else {
        newFireIntensity = 0;
    }
    
    // Update the current pixel's fire intensity by subtracting the decay value.
    firePixelsArray[currentPixelIndex - decay ] = newFireIntensity;

}

// This function draws a pixel to the screen
function draw() {

    for (let row = 0; row < fireHeight; row++) {
        
        for (let column = 0; column < fireWidth; column++) {

            // Get the index of the current pixel
            const pixelIndex = column + (fireWidth* row);
            // Get the intensity of the fire for the current pixel
            const fireIntensity = firePixelsArray[pixelIndex];
            // Get the color for the current pixel based on the fire intensity
            const color = fireColorsPalette[fireIntensity];

            // Draw a pixel using fillRect with the given color, in the given position
            ctx.fillStyle = color;
            ctx.fillRect(column*pixelSize, row*pixelSize, pixelSize, pixelSize);

        }
    }
}

// This function sets the fire source. Especially, it turns white the line at the bottom of the screen
function createFireSource() {

    for (let column = 0; column <= fireWidth; column++) {
        
        // Get the index of the overflown pixel (array+1)
        const overflowPixelIndex = fireWidth * fireHeight;
        // Demonstrate 2D pixelIndex using 1D calculation for the line at the bottom of the screen
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        // Give the biggest fire intensity for the current pixel
        firePixelsArray[pixelIndex] = 35;

    }
}

// This function turns off the fire source. Especially, it turns black the line at the bottom of the screen
function destroyFireSource() {
    
    for (let column = 0; column <= fireWidth; column++) {
    
        // Get the index of the overflown pixel (array+1)
        const overflowPixelIndex = fireWidth * fireHeight;
        // Demonstrate 2D pixelIndex using 1D calculation for the line at the bottom of the screen
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
        // Give the lowest fire intensity for the current pixel
        firePixelsArray[pixelIndex] = 0;

    }
}

// This function increases the fire source (the bottom line) with a random intensity. 
function increaseIntensityFire() {

    for (let column = 0; column <= fireWidth; column++) {

        // Get the index of the overflown pixel (array+1)
        const overflowPixelIndex = fireWidth * fireHeight;
        // Get the last row of pixels
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;
       
        // Get the current intensity of the fire
        const currentFireIntensity = firePixelsArray[pixelIndex];
        
        // If the current intensity is less than 35, increase it by a random amount
        if (currentFireIntensity < 35) {
            const increase = Math.floor(Math.random() * 14);
            // If the current intensity with the increase value is more or equal than 35, stay at 35
            if (currentFireIntensity + increase >= 35){
                newFireIntensity = 35;
            } else {
                // Add the increase
                newFireIntensity = currentFireIntensity + increase;
            }
            
            // Update the fire intensity for the current pixel
            firePixelsArray[pixelIndex] = newFireIntensity;

        }
    }
}

// This function decreases the fire source (the bottom line) with a random intensity.
function decreaseIntensityFire() {

    for (let column = 0; column <= fireWidth; column++) {

        // Get the index of the overflown pixel (array+1)
        const overflowPixelIndex = fireWidth * fireHeight;
        // Get the last row of pixels
        const pixelIndex = (overflowPixelIndex - fireWidth) + column;

        // Get the current intensity of the fire
        const currentFireIntensity = firePixelsArray[pixelIndex];

        // If the current intensity is more than 0, increase it by a random amount
        if (currentFireIntensity > 0) {
            const decay = Math.floor(Math.random() * 14);
             // If the current intensity with the decay value is more or equal than 0, apply the decay value on it.
            if ( currentFireIntensity - decay >= 0){
                newFireIntensity = currentFireIntensity - decay;
            } else {
                // Stay on 0
                newFireIntensity = 0;
            }

            // Update the fire intensity for the current pixel
            firePixelsArray[pixelIndex] = newFireIntensity;

        }
    }
}

// Keyboard Input
document.body.onkeyup = function(e) {

    // Increase/Decrease the fire intensity
    if (e.keyCode == '38') {
        // Up Arrow
        console.log("Up Arrow pressed");
        increaseIntensityFire();
    }
    else if (e.keyCode == '40') {
        // Down Arrow
        console.log("Down Arrow pressed");
        decreaseIntensityFire();
    }

    // Stop / Start fire
    if (e.keyCode == 32) {
        // Space Button
        console.log("Space pressed");
        if (burn){
            burn = false;
            destroyFireSource();
        } else {
            burn = true;
            createFireSource();
        }
    }
  }

  // Mouse Input ( Click )
  document.body.addEventListener("click", function () {
    console.log("LMB clicked");
    // Stop / Start fire
    if (burn){
        burn = false;
        destroyFireSource();
    } else {
        burn = true;
        createFireSource();
    }
});

main();

