let lives=3, score=0, hiScore=0;
const speed = {jump:250, heroX:160}
const Welcome_screen = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Welcome_screen ()
    {
        Phaser.Scene.call(this, { key: 'Welcome_screen' });
    },
    create: function(){
        this.nameMessage = this.add.text(400, 120, `Hello World`,    { fontFamily: "Arial Black", fontSize: 96, fill: '#4C986D', align: 'center' });
        this.nameMessage.setOrigin(0.5);
        this.nameMessage.setStroke('#003D1B', 6);
        this.nameMessage.setShadow(2, 2, "#003D1A", 2, true, true);
        this.startMessage = this.add.text(400, 490, `Appuyez sur 'S' pour démarrer`,  { font: '72px Arial', fill: '#4C986D', align: 'center' });
        this.startMessage.setOrigin(0.5);
        this.startMessage.setStroke('#003D1B', 6);
        this.startMessage.setShadow(2, 2, "#003D1A", 2, true, true);
        this.keyGo  =  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    },
    update: function(time, delta){
        if(this.keyGo.isDown){
            this.scene.start('Level_1');
        }
    }
});

const Game_over = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Game_over ()
    {
        Phaser.Scene.call(this, { key: 'Game_over' });
    },
    preload: function(){
        this.load.spritesheet('sparks', 'assets/sparks_sprites.png', { frameWidth: 128, frameHeight: 128 });
    },
    create: function(){
        this.keyGo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyContinue = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.congratulationsMessage = this.add.text(400, 120, ``,    { fontFamily: "Arial Black", fontSize: 84, fill: '#4C986D', align: 'center' });
        this.congratulationsMessage.setOrigin(0.5);
        this.congratulationsMessage.setStroke('#003D1B', 6);
        this.congratulationsMessage.setShadow(2, 2, "#003D1A", 2, true, true);
        if(lives>0){
            this.congratulationsMessage.setText('Congratulations');
            this.particles = this.add.particles('sparks');
            this.particlesEmitter = this.particles.createEmitter({
                x: 400,
                y: -20,
                angle: { min: 180, max: 360 },
                speed: 400,
                gravityY: 350,
                lifespan: 4000,
                quantity: 6,
                scale: { start: 0.1, end: 1 },
                frame :  [0,1,2,3,4]
            });
        }else{
            this.congratulationsMessage.setText('Too bad !');
        }

        this.startMessage = this.add.text(400, 200, `Press 'S' to start again`,  { font: '72px Arial', fill: '#4C986D', align: 'center' });
        this.startMessage.setOrigin(0.5);
        this.startMessage.setStroke('#003D1B', 6);
        this.startMessage.setShadow(2, 2, "#003D1A", 2, true, true);
        if(score>hiScore)
            hiScore=score;
        this.scoreMessage = this.add.text(175, 490, `Score : ${score}`,    { font: '72px Arial', fill: '#4C986D', align: 'center' });
        this.hiScoreMessage = this.add.text(630, 490, `Best : ${hiScore}`,    { font: '72px Arial', fill: '#4C986D', align: 'center' });
        this.scoreMessage.setOrigin(0.5);
        this.hiScoreMessage.setOrigin(0.5);
        this.scoreMessage.setStroke('#003D1B', 6);
        this.scoreMessage.setShadow(2, 2, "#003D1A", 2, true, true);
        this.hiScoreMessage.setStroke('#003D1B', 6);
        this.hiScoreMessage.setShadow(2, 2, "#003D1A", 2, true, true);
    },
    update: function(time, delta){
        if(this.keyGo.isDown){
            lives = 3;
            score = 0;
            this.scene.start('Welcome_screen');
        }
    }
});

//        this.load.spritesheet('sparks', 'assets/sparks_sprites.png', { frameWidth: 128, frameHeight: 128 });

const Level_1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function Level_1 ()
    {
        Phaser.Scene.call(this, { key: 'Level_1' });
    },
    preload: function(){
        this.load.image('tuto_tiles', 'assets/tuto_tiles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.tilemapTiledJSON('tuto_level_1', 'assets/tuto_level_1.json');
        this.load.spritesheet('hero', 'assets/tuto_hero.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemy_1', 'assets/tuto_enemy_1.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemy_2', 'assets/tuto_enemy_2.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('enemy_3', 'assets/tuto_enemy_3.png', { frameWidth: 16, frameHeight: 16 });
    },
    create: function(){
        this.map = this.make.tilemap({ key: 'tuto_level_1' });
        const tileset_base = this.map.addTilesetImage('tuto_tiles', 'tuto_tiles');
        this.worldLayer = this.map.createDynamicLayer('platforms', tileset_base, 0, 0);
        this.worldLayer.setCollisionByProperty({collides: true});
        this.physics.world.bounds.width = this.worldLayer.width;
        this.physics.world.bounds.height = this.worldLayer.height;

        this.spawnPoint = this.map.findObject('positions', obj => obj.type === 'spawn');
        this.endPoint = this.map.findObject('positions', obj => obj.type === 'level_end');

        this.hero = this.physics.add.sprite(this.spawnPoint.x, this.spawnPoint.y, 'hero');
        this.hero.setBounce(0);
        this.hero.setCollideWorldBounds(true);
        this.hero.body.onWorldBounds = true;
        this.hero.body.setCircle(8);
        this.hero.flipX = true;
        this.physics.add.collider(this.worldLayer, this.hero);

        this.cameras.main.startFollow(this.hero, true, 0.08, 0.08);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setBackgroundColor('#ccccff'); 


        this.anims.create({
            key: 'hero_walk',
            frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_1_walk',
            frames: this.anims.generateFrameNumbers('enemy_1', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_2_walk',
            frames: this.anims.generateFrameNumbers('enemy_2', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'enemy_3_walk',
            frames: this.anims.generateFrameNumbers('enemy_3', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        //when the hero is out of bound => losing a life
        this.physics.world.on('worldbounds', function(body,up,down,right,left){
            if(down){
                lives--;
                emitter.emit('HUD_update', score, lives);
                if(lives>0){
                    this.scene.restart();
                }else{
                    this.scene.start('Game_over');
                }
            }
        },this);


        this.enemiesLayer = this.map.filterObjects('enemies', obj => obj.type.startsWith('enemy_'));
        this.enemies = this.physics.add.group({
            allowGravity: true
        });

        this.enemiesLayer.map(e=>{
            let en = this.enemies.create(e.x, e.y, e.type).setImmovable(true);
            en.setCollideWorldBounds(false);
            en.body.setCircle(8);
            en.anims.play(e.type+'_walk');
        });
        this.physics.add.collider(this.enemies, this.worldLayer);
        this.physics.add.collider(this.enemies, this.hero, this.enemyHit.bind(this));


        this.cursors = this.input.keyboard.createCursorKeys();

     
        this.hero.anims.play('hero_walk');

    },
    update: function(time, delta){
        if(Phaser.Math.Distance.Between(this.hero.body.x, this.hero.body.y,this.endPoint.x,this.endPoint.y) <= 30){
            this.scene.start('Game_over');
        }
        if(this.hero.body.velocity.x < 0){
            this.hero.flipX = false;
        }
        if(this.hero.body.velocity.x > 0){
            this.hero.flipX = true;
        }
        if(this.hero.body.velocity.x == 0){
            this.hero.setFrame(0);
        }


        if ((this.cursors.space.isDown || this.cursors.up.isDown))
        {
            if(this.canJump && this.hero.body.onFloor()){
                this.hero.body.setVelocityY(-speed.jump); // jump up
                this.canJump = false;
            }
        }
        if (this.cursors.left.isDown)
        {
            this.hero.setVelocityX(-speed.heroX);
        }
        else if (this.cursors.right.isDown)
        {
            this.hero.setVelocityX(speed.heroX);
        }
        else
        {
            this.hero.setVelocityX(0);
        }
        if(this.hero.body.onFloor()){
            this.canJump = true;
        }

        this.enemies.children.each( e => {
            if(Phaser.Math.Distance.Between(this.hero.body.x, this.hero.body.y, e.body.x, e.body.y) <= 150){
                if(this.hero.body.x < e.body.x){
                    e.setVelocityX(Phaser.Math.FloatBetween(-100, -50));
                }else{
                    e.setVelocityX(Phaser.Math.FloatBetween(50, 100));
                }
            }else{
                e.setVelocityX(0);
            }
            if(this.hero.body.x < e.body.x)
                e.flipX = false;
            else
                e.flipX = true;
            if(e.body.velocity.x == 0)
                e.setFrame(0);
        })


    },
    enemyHit: function(theHero, theBadGuy){
        if(theBadGuy.body.touching.up){
            theBadGuy.destroy();
            score+=50;
        }else{
            lives--;
            if(lives>0)
                this.scene.restart();
            else{
                this.scene.start('Game_over');
            }
        }
    }
});

const HUD = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize: function HUD ()
    {
        Phaser.Scene.call(this, { key: 'HUD', active:true });
    },
    create: function(){
        this.scoreText = this.add.text(35, 580, ``,  { font: '15px Arial', fill: '#000000' });
    },
    update: function(){
        this.scene.bringToTop();
        this.scoreText.setText(`${score}        ❤️${lives}`);
    }
});

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 450 },
            debug: false
        }
    },
    parent: 'game-container',
    scene: [Welcome_screen, Level_1, HUD, Game_over]
};

const game = new Phaser.Game(config);