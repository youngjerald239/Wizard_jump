import Phaser from "../lib/phaser.js";

export default class Game extends Phaser.Scene{
    /** @type {Phaser.Physics.Arcade.Sprite} */
    player

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
    }

    create()
    {
        this.add.image(240, 320, 'background')

        // add the platform image in the center
        // this.add.image(240, 320, 'platform')
        //     .setScale(0.5)
        // this.physics.add.staticImage(240, 320, 'platform')
        //     .setScale(0.5)
        //Creates multiple platforms
        const platforms = this.physics.add.staticGroup()

        // 5 platforms from the group for loop
        for (let i = 0; i < 5; ++i){
            const x = Phaser.Math.Between(80, 400)
            const y = 150 * i

            /** @type {Phaser.Physics.Arcade.Sprite} */
            const platform = platforms.create(x, y, 'platform')
            platform.scale = 0.5

            /** @type {Phaser.Physics.Arcade.StaticBody} */
            const body = platform.body
            body.updateFromGameObject()
        }
        // add player sprite
        this.player = this.physics.add.sprite(240, 320, 'wizkid_stand')
            .setScale(0.5)
        this.physics.add.collider(platforms, this.player)

        // Collision for sprite
        this.player.body.checkCollision.up = false
        this.player.body.checkCollision.left = false
        this.player.body.checkCollision.right = false

        // Camera follows the player
        this.cameras.main.startFollow(this.player)
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
    }
}