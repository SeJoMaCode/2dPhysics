let c;
let ctx;

window.onload = init;

function init(){
    c = document.querySelector('canvas')
    ctx = c.getContext('2d')
    resize()

    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp){
    window.onresize = resize()
    draw()
    window.requestAnimationFrame(gameLoop)
}

function resize(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

class Ball{
    constructor(x, y){
        this.pos = [x,y]
        this.velocity = [0,0]
        this.radius = 20
        this.gravity = 1
        this.termV = 10
    }

    AddForce(x, y){
        this.velocity[0] += x
        this.velocity[1] += y
    }

    move(){
        this.pos[0] +=  this.velocity[0]
        this.pos[1] +=  this.velocity[1]

        if(!(this.radius < this.pos[1])){
            this.pos[1] = this.radius
            this.velocity[1] *= -1*1/2
        } else if(!(this.pos[1] < c.height-this.radius)){
            this.pos[1] = c.height-this.radius
            this.velocity[1] *= -1*1/2
        }
        
        if(!(this.radius < this.pos[0])){
            this.pos[0] = this.radius
            this.velocity[0] *= -1*7/10
        } else if(!(this.pos[0] < c.width-this.radius)){
            this.pos[0] = c.width-this.radius
            this.velocity[0] *= -1*7/10
        }

        if (this.pos[1] < c.height-this.radius){
            this.velocity[1] += this.gravity
        } else {
            this.pos[1] = c.height-this.radius
            if (this.velocity[0] < .5 && this.velocity[0] > -.5){
                this.velocity[0] = 0
            } else if (this.velocity[0] > 0){
                this.velocity[0] -= .5
            } else if (this.velocity[0] < 0){
                this.velocity[0] += .5
            }
        }
    }

    draw(){
        ctx.fillStyle = '#000'
        ctx.beginPath()
        ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2*Math.PI)
        ctx.fill()
    }
}

const ball = new Ball(500,100)

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

function draw(){
    // console.log(ball.pos[1])
    ball.move()
    ball.draw()
}