import Phaser from "../lib/phaser.js";

export default class Game extends Phaser.Scene{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

    /** @type {Phaser.Physics.Arcade.StaticGroup} */
    platforms

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    cursors 

    constructor(){
        super('game')
    }

    preload()
    {
        this.load.image('background', 'assets/bg_layer1.png')

        // load the platform image
        this.load.image('platform', 'assets/ground_grass.png')

        // load the player image
        this.load.image('wizkid_stand', 'assets/wizbizstand.png')

        // cursors keys for controls
        this.cursors = this.input.keyboard.createCursorKeys()
    }

    create()
    {
        this.add.image(240, 320, 'background')
        .setScrollFactor(1, 0)

        // add the platform image in the center
        // this.add.image(240, 320, 'platform')
        //     .setScale(0.5)
        // this.physics.add.staticImage(240, 320, 'platform')
        //     .setScale(0.5)
        //Creates multiple platforms
        this.platforms = this.physics.add.staticGroup()

        // 5 platforms from the group for loop
        for (let i = 0; i < 5; ++i){
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = this.platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }
        // add player sprite
        this.player = this.physics.add.sprite(240, 320, 'wizkid_stand')
            .setScale(0.5)
        // add more platforms
        this.physics.add.collider(this.platforms, this.player)

        // Collision for sprite
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        // Camera follows the player
        this.cameras.main.startFollow(this.player)

        // set the horizontal dead zone to 1.5x game width
        this.cameras.main.setDeadzone(this.scale.width * 1.5)
    }

    update()
    {
        // find out from Arcade Physics if the player's physics body
        // is touching something below it
        const touchingDown = this.player.body.touching.down
        if (touchingDown)
        {
            // this makes wizkid jump straight up
            this.player.setVelocityY(-300)
        }
            // movement left and right
        if (this.cursors.left.isDown && !touchingDown)
        {
            this.player.setVelocityX(-200)
        } else if (this.cursors.right.isDown && !touchingDown)
        {
            this.player.setVelocityX(200)
        }
        else 
        {
            //Stops movement
            this.player.setVelocityX(0)
        }

        this.horizontalWrap(this.player)

        this.platforms.children.iterate(child => {
            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = child
            const scrollY = this.cameras.main.scrollY
            if (platform.y >= scrollY + 700)
            {
                platform.y = scrollY - Phaser.Math.Between(50, 100)
                platform.body.updateFromGameObject()
            }

        })
    }
    /** 
     * * @param {Phaser.GameObjects.Sprite} sprite
     * */
    horizontalWrap(sprite)
    {
        const halfWidth = sprite.displayWidth * 0.5
        const gameWidth = this.scale.width
        if (sprite.x < -halfWidth)
            {
            sprite.x = gameWidth + halfWidth
            
        }
         else if (sprite.x > gameWidth + halfWidth)
        {
            sprite.x = -halfWidth
            
        }
        
    }
    
}