class End_Screen extends Phaser.Scene {
    constructor() {
        super("endScreen");
    }

    preload() {
        //load images
        this.load.image('logo', './assets/megagolftitle.png');

        //load audio files
        this.load.audio("menuSelect", "./assets/menuSelect.wav");
    }

    create() {
        this.cameras.main.setBackgroundColor("#5A5");
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.hasChosen = false;
        this.creditsRoll = false;

        let menuConfig = {
            fontFamily: "Courier",
            fontSize: "32px",
            color: "#000",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        };

        let centerX = game.config.width / 2;
        let centerY = game.config.height / 2;
        let textSpacer = 64;

        // (↑) & (↓)
        this.upper = this.add.text(centerX, 100, "Press (↑) to return to the main menu.", menuConfig)
            .setOrigin(.5);
        this.creditsMark = this.add.text(centerX, game.config.height + 1.25 * textSpacer,
            "Mark Medved - Level Designer/Programmer", menuConfig).setOrigin(.5);
        this.creditsBen = this.add.text(centerX, game.config.height + 2 * textSpacer,
            "Ben Rowland - UI Designer/Programmer", menuConfig).setOrigin(.5);
        this.creditsThane = this.add.text(centerX, game.config.height + 2.75 * textSpacer,
            "Thane Wisherop - Artist/Animator", menuConfig).setOrigin(.5);
        this.creditsSound = this.add.text(centerX, game.config.height + 3.5 * textSpacer,
            "Sound Design by Mark Medved and Ben Rowland", menuConfig).setOrigin(.5);
        this.logo = this.add.image(centerX, centerY + 50, 'logo').setScale(2.5, 2.5);

        // dropping letter config
        let letterConfig = {
            fontFamily: "Courier",
            fontSize: "64px",
            strokeThickness: 3,
            color: "#FFD700",
            align: "center",
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0,
            offsetX: 5,
            offsetY: 5,
            fill: true
        };
    
        //prepare letters to drop
        this.c1 = this.add.text(centerX/3, -10, "C", letterConfig).setOrigin(.5);
        this.o1 = this.add.text(centerX/3 + 40, -10, "O", letterConfig).setOrigin(.5);
        this.n1 = this.add.text(centerX/3 + 80, -20, "N", letterConfig).setOrigin(.5);
        this.g1 = this.add.text(centerX/3 + 120, -30, "G", letterConfig).setOrigin(.5);
        this.r1 = this.add.text(centerX/3 + 160, -40, "R", letterConfig).setOrigin(.5);
        this.a1 = this.add.text(centerX/3 + 200, -50, "A", letterConfig).setOrigin(.5);
        this.t1 = this.add.text(centerX/3 + 240, -60, "T", letterConfig).setOrigin(.5);
        this.u1 = this.add.text(centerX/3 + 280, -70, "U", letterConfig).setOrigin(.5);
        this.l1 = this.add.text(centerX/3 + 320, -80, "L", letterConfig).setOrigin(.5);
        this.a2 = this.add.text(centerX/3 + 360, -90, "A", letterConfig).setOrigin(.5);
        this.t2 = this.add.text(centerX/3 + 400, -100, "T", letterConfig).setOrigin(.5);
        this.i1 = this.add.text(centerX/3 + 440, -110, "I", letterConfig).setOrigin(.5);
        this.o2 = this.add.text(centerX/3 + 480, -120, "O", letterConfig).setOrigin(.5);
        this.n2 = this.add.text(centerX/3 + 520, -130, "N", letterConfig).setOrigin(.5);
        this.s1 = this.add.text(centerX/3 + 560, -140, "S", letterConfig).setOrigin(.5);
        this.excl = this.add.text(centerX/3 + 600, -150, "!", letterConfig).setOrigin(.5);

        //wait until letter drop is done
        this.time.addEvent({
            delay: 1300,
            callback: () => { 
                this.creditsRoll = true;
            },
            loop: false,
            callbackScope: this
        });
    }

    update() {
        if(this.c1.y < game.config.height/4) {
            this.c1.y++;
        }
        if(this.o1.y < game.config.height/4) {
            this.o1.y++;
        }
        if(this.n1.y < game.config.height/4) {
            this.n1.y++;
        }
        if(this.g1.y < game.config.height/4) {
            this.g1.y++;
        }
        if(this.r1.y < game.config.height/4) {
            this.r1.y++;
        }
        if(this.a1.y < game.config.height/4) {
            this.a1.y++;
        }
        if(this.t1.y < game.config.height/4) {
            this.t1.y++;
        }
        if(this.u1.y < game.config.height/4) {
            this.u1.y++;
        }
        if(this.l1.y < game.config.height/4) {
            this.l1.y++;
        }
        if(this.a2.y < game.config.height/4) {
            this.a2.y++;
        }
        if(this.t2.y < game.config.height/4) {
            this.t2.y++;
        }
        if(this.i1.y < game.config.height/4) {
            this.i1.y++;
        }
        if(this.o2.y < game.config.height/4) {
            this.o2.y++;
        }
        if(this.n2.y < game.config.height/4) {
            this.n2.y++;
        }
        if(this.s1.y < game.config.height/4) {
            this.s1.y++;
        }
        if(this.excl.y < game.config.height/4) {
            this.excl.y++;
        }

        if (Phaser.Input.Keyboard.JustDown(keyUP) && !this.hasChosen) {
            this.hasChosen = true;
            this.sound.play("menuSelect");
            this.time.addEvent({
                delay: 1300,
                callback: () => { 
                    this.scene.start("menuScene");
                },
                loop: false,
                callbackScope: this
            });
        }

        if (this.creditsRoll) {
            this.logo.y -= .3;
            this.creditsMark.y--;
            this.creditsBen.y--;
            this.creditsThane.y--;
            this.creditsSound.y--;
            if(this.creditsMark.y <= 2*game.config.height/3) {
                this.creditsRoll = false;
            }
        }
    }
}
