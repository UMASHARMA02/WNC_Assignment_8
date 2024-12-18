/**
 * variable to select canvas element from DOM
 */
let canvas = document.getElementById("myCanvas");
/**
 * to display canas in 2D
 */
let context = canvas.getContext("2d");

/**
 * variable to get input element from DOM which selects image to be loaded
 */
const imageInput = document.getElementById('imageInput');
/**
 * variable to get div container from DOM which has canvas inside it
 */
const background = document.getElementById("background");

/**
 * Event Listner to add background image of the container in which canvas is present
 */
imageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const imgURL = URL.createObjectURL(file);
        background.style.backgroundImage = `url(${imgURL})`;
        background.style.backgroundRepeat = "no-repeat";
        background.style.backgroundSize = "cover";
        
    }
});

/**
 * variable to store circle objects
 */
var arr = [];
/**
 * variable to count the objects of circle
 */
var counter = 1;

/**
 * variable to store selected object
 */
var selectedObject = null

/**
 * variable to store all the objects that are selected for deleting
 */
var deletedObjectArray = [];


// -----------------------------------------------------------------------------------------------------------
/**
 * Event listener for clicking inside canvas
 */
canvas.addEventListener("click",(e)=>{
    const rect = canvas.getBoundingClientRect(); //to know coordinated of canvas element 

    let xClick = e.clientX - rect.left;   //left - x coordinate in reference to canvas
    let yClick = e.clientY - rect.top;


    arr.forEach((item)=>{
        if(item.isSelected(xClick,yClick)){
            if(selectedObject == item) { // if any onject is selected earlier 
                selectedObject = null;
                return ;
            } 
            selectedObject = item;
            console.log(item.isSelected(xClick,yClick) + " for "+ item.text);            
        }
    })
    // console.log(`selected object is ${selectedObject}`)
})

/**
 * Event listener for clicking inside canvas
 */

canvas.addEventListener("mousemove",(e)=>{
    if(selectedObject != null) {
        selectedObject.move2(e.offsetX ,e.offsetY );
        drawCircleAgain(context);
    }
})
// ------------------------------------------------------------------------------------------------------------




//-------------------------------------------------------------------------------------------------------
/**
 * Event listener for selecting objects to be deleted by doubleclick
 */
canvas.addEventListener("dblclick",(e)=>{
    const rect = canvas.getBoundingClientRect(); //to know coordinated of canvas element 
    let xClick = e.clientX - rect.left;   //left - x coordinate in reference to canvas
    let yClick = e.clientY - rect.top;
    arr.forEach((item)=>{
        if(item.isSelected(xClick,yClick)){
            if(deletedObjectArray.indexOf(item)==-1){
                deletedObjectArray.push(item);  
            }  
            console.log(deletedObjectArray);
        }
    })
})

//---------------------------------------------------------------------------------------------------------


/**
 * Class circle which has function to
 * 1.Draw Circle
 * 2.Move Circle
 * 3.To check if any object is selected
 * and constructor which accepts X-coordinate, Y-coordinate, Radius, Color and Text to be displayed
 */
class Circle{
    constructor(x,y,r,color,text){
        this.text = text;
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
    }
    
    /////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 
     * @param {*} context context of canvas
     * function to draw circle - set its width, color, font and coordinated 
     */
    draw(context){
        //fill color of stroke text
        context.fillStyle = this.color;
        
        //fill color of cricle
        context.strokeStyle =this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font= "20px Arial";
        context.fillText(this.text,this.x,this.y);

        //circle
        context.lineWidth = 5;
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI*2);
        context.stroke();
        context.closePath();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * function to check if the object is selected or not
     * @param {*} xClick x-coordinate where the mouse clicked on the screen
     * @param {*} yClick y-coordinate where the mouse clicked on the screen
     * @returns boolean
     */
    isSelected(xClick,yClick){
        const distance = Math.sqrt((xClick-this.x)*(xClick-this.x)+(yClick-this.y)*(yClick-this.y));
        if(distance > this.r){
            return false;
        }else{
            return true;
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * function to set x and y coordinates of a circle to random location
     */
    move1(){
        // const random_xTranslate = Math.floor(Math.random() * 100 + 10);
        // const random_yTranslate = Math.floor(Math.random() * 100 + 10);
        // context.translate(random_xTranslate,random_yTranslate);
        this.x = Math.random() * 100 + 10;
        this.y = Math.random() * 100 + 10;
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * setting x and y coordinate according to mouse position
     * @param {*} screen_x x-coordinate of mouse relative to the circle plus 3/2 times radius
     * @param {*} screen_y y-coordinate of mouse relative to the circle plus 3/2 times radius
     */
    move2(screen_x,screen_y){
        this.x = screen_x;
        this.y = screen_y;
    }

    ///////////////////////////////////////////////////////////////////////////////////////
    delete(){
        let index = arr.indexOf(this);
        arr.splice(index,1);
    }
                 
}

/**
 * function to redraw all the objects of circle after one object has been moved
 * @param {*} context context of canvas
 */
function drawCircleAgain(context){
    context.clearRect(0, 0, canvas.width, canvas.height);
    arr.forEach(circle => circle.draw(context));
}
/**
 * function which is executed on clicking circle button which makes circle object on canvas using draw() member function of Class circle and stores the objects into arr0ys
 */
function drawCircle(){
    const rect = canvas.getBoundingClientRect();
    // console.log(rect);
    let random_x =  Math.floor((Math.random() * canvas.width-100)+100);
    let random_y =  Math.floor((Math.random() *canvas.height -100)+100);
    let random_r = Math.floor((Math.random() * canvas.height/4) + 10);
    let random_color = `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
    
    //drawing new circle
    let newCircle = new Circle(random_x,random_y,random_r,random_color,counter);
    counter++;
    newCircle.draw(context);

    //storing circle into the array
    arr.push(newCircle);
    // console.log(arr);  
}


function deleteObject(){
    setTimeout(()=>{
        let toBeDeleted = deletedObjectArray[0];
        deletedObjectArray.splice(0,1);
        toBeDeleted.delete();
        drawCircleAgain(context);
    },5000)
}