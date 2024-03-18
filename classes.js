class Sprite {
    constructor({position, imageSrc, framesMax = 1, offset = {x: 0, y:0}}) {
        this.position = position;
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.offset = offset
    }

    draw() {
        if (this.image.complete && this.image.naturalWidth !== 0) {
            c.drawImage(
                this.image, 
                this.framesCurrent * (this.image.width / this.framesMax), 
                0, 
                this.image.width / this.framesMax, 
                this.image.height, 
                this.position.x - this.offset.x, 
                this.position.y - this.offset.y, 
                (this.image.width / this.framesMax), 
                this.image.height
            );
        }
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position, 
        velocity, 
        offset, 
        color = 'red', 
        imageSrc, 
        framesMax = 1,
        sprites
    }) {
        super({
            position,
            imageSrc,
            framesMax
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5
        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        this.image.onload = () => {
            this.imageLoaded = true
        }
    }

    update() {
        if (!this.imageLoaded) {
            return;
        }

        this.draw()
        this.animateFrames()

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x - 20
        this.attackBox.position.y = this.position.y

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width -20, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 63) {
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity
        }
    }

    playerAttack() { 
        this.switchSprite('melee')
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100)
    } 
    enemyAttack() {
        enemy.switchSprite('melee')
        enemy.isAttacking = true
        setTimeout(() => {
            enemy.isAttacking = false
        }, 100)
    }
    takeHit() {
        this.switchSprite('takeHit')
        this.health -= 20
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.melee.image && this.framesCurrent < this.sprites.melee.framesMax - 1) return

        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    if (this.image == this.sprites.takeHit.image) {
                        setTimeout(() => {
                            this.image = this.sprites.idle.image
                        }, 1000)
                    }
                    if (player.lastKey == 's') {
                        setTimeout(() => {
                            this.image = this.sprites.idle.image
                        }, 1000)
                    }
                    if (enemy.lastKey == 'ArrowDown') {
                        setTimeout(() => {
                            this.image = this.sprites.idle.image
                        }, 1000)
                    }
                    if (player.lastKey !== 's') {
                            this.image = this.sprites.idle.image
                    }
                    if (enemy.lastKey !== 'ArrowDown') {
                            this.image = this.sprites.idle.image
                    }
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                }
                break
            case 'jump':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.jump.image
                }
                break
            case 'melee':
                if (this.image !== this.sprites.melee.image) {
                    this.image = this.sprites.melee.image
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                }
                break
        }
    }
}