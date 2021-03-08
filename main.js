let c;
let ctx;

// initialize everything when page loads
window.onload = init;

//what to initialize
function init(){
    c = document.querySelector('canvas')
    ctx = c.getContext('2d')
    resize()

    // start the game loop
    window.requestAnimationFrame(gameLoop)
}

//game loop
function gameLoop(timeStamp){
    window.onresize = resize()
    draw()
    window.requestAnimationFrame(gameLoop)
}

//resize canvas to the screen
function resize(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

//class for the ball object
class Ball{
    //set the initial properties of the ball
    constructor(x, y){
        this.pos = [x,y]
        this.velocity = [0,0]
        this.radius = 20
        this.gravity = 1
        this.termV = 10
    }

    //add force the the ball
    AddForce(x, y){
        this.velocity[0] += x
        this.velocity[1] += y
    }

    //logic for moving ball
    move(){
        //add velocity to position
        this.pos[0] +=  this.velocity[0]
        this.pos[1] +=  this.velocity[1]

        //bounce off top and bottom and lose some velocity
        if(!(this.radius < this.pos[1])){
            this.pos[1] = this.radius
            this.velocity[1] *= -1*1/2
        } else if(!(this.pos[1] < c.height-this.radius)){
            this.pos[1] = c.height-this.radius
            this.velocity[1] *= -1*1/2
        }

        //bounce off left and right and lose some velocity
        if(!(this.radius < this.pos[0])){
            this.pos[0] = this.radius
            this.velocity[0] *= -1*7/10
        } else if(!(this.pos[0] < c.width-this.radius)){
            this.pos[0] = c.width-this.radius
            this.velocity[0] *= -1*7/10
        }

        //apply gravity if in the air
        if (this.pos[1] < c.height-this.radius){
            this.velocity[1] += this.gravity
        } else {
            //lose speed from rolling on the ground
            if (this.velocity[0] < .5 && this.velocity[0] > -.5){
                this.velocity[0] = 0
            } else if (this.velocity[0] > 0){
                this.velocity[0] -= .5
            } else if (this.velocity[0] < 0){
                this.velocity[0] += .5
            }
        }
    }

    //draw the ball
    draw(){
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI)
        ctx.fill()
    }
}

//make the instance of the ball
const ball = new Ball(500,100)

//listen for keypresses and add force
document.addEventListener('keydown', e => {
    if(e.key=='w' && ball.pos[1] > c.height-(ball.radius+5)){
        ball.AddForce(0, -20)
    }
    if(e.key=='a' && ball.velocity[0] > -ball.termV){
        ball.AddForce(-1, 0)
    }
    if(e.key=='d' && ball.velocity[0] < ball.termV){
        ball.AddForce(11, 0)
    }
})

//draw and move the ball in the game loop
function draw(){
    ball.move()
    ball.draw()
}