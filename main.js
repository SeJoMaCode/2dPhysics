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
        this.x = x
        this.y = y
        this.velocity = [0,0]
        this.radius = 20
        this.gravity = 1
        this.termV = 5
        this.grounded = false
        this.points = 0
    }

    //add force the the ball
    AddForce(x, y){
        this.velocity[0] += x
        this.velocity[1] += y
    }

    //logic for moving ball
    move(){
        //add velocity to position
        this.x +=  this.velocity[0]
        this.y +=  this.velocity[1]

        if(this.x > c.width-this.radius){
            this.x = c.width-this.radius
            this.velocity[0] = 0
        }
        if(this.x < this.radius){
            this.x = this.radius
            this.velocity[0] = 0
        }

        if (this.velocity[0] < .2 && this.velocity[0] > -.2){
            this.velocity[0] = 0
        } else if (this.velocity[0] > 0){
            this.velocity[0] -= .2
        } else if (this.velocity[0] < 0){
            this.velocity[0] += .2
        }

        if (this.y > c.height-this.radius){
            this.y = c.height-this.radius
            this.velocity[1] = 0
            //lose speed from rolling on the ground
        } else if(!this.grounded){
            this.velocity[1] += this.gravity
        }
    }

    //draw the ball
    draw(){
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI)
        ctx.fill()
    }
}
//make the instance of the ball
const ball = new Ball(500,100)

class Platform {
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.width = w
        this.height = h
    }

    handleCollision(obj){
        if(obj.x >= this.x && obj.x <= this.x + this.width && obj.y >= this.y-obj.radius && obj.y <= this.y+this.height && (obj.velocity[1] >= 0)){
            obj.grounded = true
            obj.velocity[1] = 0
            obj.y = this.y - obj.radius
            return true
        } else {
            return false
        }
    }

    draw(){
        ctx.fillStyle = '#fff'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const platforms = []
platforms.push(new Platform(600, 800, 100, 25))
platforms.push(new Platform(750, 850, 100, 25))

class Coin {
    constructor(x,y,w,h){
        this.x = x
        this.y = y
        this.width = 10
        this.height = 10
    }

    handleCollision(obj){
        const cx = this.x + this.width / 2, cy = this.y - this.height / 2;
        const px = ball.x, py = ball.y + ball.radius; 
        if(Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2)) < ball.radius){
            obj.points++
            return true
        } else {
            return false
        }
    }

    draw(){
        ctx.fillStyle = '#eee'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

const coins = []
coins.push(new Coin(645, 750))
coins.push(new Coin(795, 800))

//listen for keypresses and remember what keys are pressed
var keys = {
    w: false,
    a: false,
    d: false
}
document.addEventListener('keydown', e => {
    if(e.key=='w') keys.w = true
    if(e.key=='a') keys.a = true
    if(e.key=='d') keys.d = true
})
document.addEventListener('keyup', e => {
    if(e.key=='w') keys.w = false
    if(e.key=='a') keys.a = false
    if(e.key=='d') keys.d = false
})

//draw and move the ball in the game loop
function draw(){
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0,c.width,c.height)

    let onPlatform = false
    platforms.forEach(platform => {
        platform.draw()
        if(platform.handleCollision(ball)){
            onPlatform = true
        }
    })

    coins.forEach((coin, i) => {
        coin.draw()
        if(coin.handleCollision(ball)){
            coins.splice(i, 1)
        }
    })

    ctx.font = '48px Arial';
    ctx.fillText(`${ball.points} Points`, 10, 50);

    if(ball.points >= 2){
        ctx.textAlign = 'center'
        ctx.fillText('You Win', c.width/2, c.height/2);
    }

    if(!onPlatform){
        ball.grounded = false
    }

    if(keys.w && (ball.y > c.height-(ball.radius+5) || ball.grounded)) ball.AddForce(0, -20)
    if(keys.a && ball.velocity[0] > -ball.termV) ball.AddForce(-.5, 0)
    if(keys.d && ball.velocity[0] < ball.termV) ball.AddForce(.5, 0)
    ball.move()
    ball.draw()
}