const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'Background.png'
})
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './wizard/wizardidle.png',
    sprites: {
        idle : {
            imageSrc: './wizard/wizardidle.png'
        },
        run : {
            imageSrc: './wizard/wizardwalk2.png'
        },
        jump : {
            imageSrc: './wizard/wizardjump.png'
        },
        melee : {
            imageSrc: './wizard/wizard melee2.png'
        },
        takeHit : {
            imageSrc: './wizard/wizardhit.png'
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 955,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0    
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './witch/witchidle1.png',
    sprites: {
        idle : {
            imageSrc: './witch/witchidle1.png'
        },
        run : {
            imageSrc: './witch/witchwalk2.png'
        },
        jump : {
            imageSrc: './witch/witchjump.png'
        },
        melee : {
            imageSrc: './witch/witchmelee3.png'
        },
        takeHit : {
            imageSrc: './witch/witchhit.png'
        }
    }
})

console.log(player);

const keys = {
    a: {        
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

var playerAntiDoubleJump = true
var enemyAntiDoubleJump = true

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5
        if (player.velocity.x !== 0 && player.velocity.y !== 0){
            player.switchSprite('jump')
        } else {
            player.switchSprite('run')
        }
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5
        if (player.velocity.x !== 0 && player.velocity.y !== 0){
            player.switchSprite('jump')
        } else {
            player.switchSprite('run')
        }
    } else {
        player.switchSprite('idle')
    }

    //player jumping
    if (keys.w.pressed && playerAntiDoubleJump) {
        playerAntiDoubleJump = false
        player.velocity.y = -18
    }
    if (player.velocity.y !== 0) {
        player.switchSprite('jump')
    }
    if(Math.floor(player.position.y / 10) == Math.floor(363.69999999999993 / 10)) {
        playerAntiDoubleJump = true
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
        if (enemy.velocity.x !== 0 && enemy.velocity.y !== 0){
            enemy.switchSprite('jump')
        } else {
            enemy.switchSprite('run')
        }
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
        if (enemy.velocity.x !== 0 && enemy.velocity.y !== 0){
            enemy.switchSprite('jump')
        } else {
            enemy.switchSprite('run')
        }
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jumping
    if (keys.ArrowUp.pressed && enemyAntiDoubleJump) {
        enemyAntiDoubleJump = false
        enemy.velocity.y = -18
    }
    if (enemy.velocity.y !== 0) {
        enemy.switchSprite('jump')
    }
    if(Math.floor(enemy.position.y / 10) == Math.floor(363.69999999999993 / 10)) {
        enemyAntiDoubleJump = true
    }

    // detect for collision
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
    }) &&
        player.isAttacking
    ) {
        enemy.takeHit()
        player.isAttacking = false
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
    }) &&
        enemy.isAttacking
    ) {
        player.takeHit()
        enemy.isAttacking = false
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            keys.w.pressed = true
            break
        case 's':
            player.playerAttack() 
            player.lastKey = 's'
            break

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = true
            break
        case 'ArrowDown':
            enemy.enemyAttack()
            enemy.lastKey = 'ArrowDown'
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = false
            break
        case 'a': 
            keys.a.pressed = false   
            break
        case 'w':
            keys.w.pressed = false
            break

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft': 
            keys.ArrowLeft.pressed = false   
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
})