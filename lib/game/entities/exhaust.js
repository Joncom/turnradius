ig.module('game.entities.exhaust')

.requires('impact.entity')

.defines(function() {

    EntityExhaust = ig.Entity.extend({

        size: { x: 8, y: 8 },
        zIndex: 5,

        rotate_rate: 10,
        rotate_degree: 30,
        rotate_timer: null,

        animSheet: new ig.AnimationSheet('media/exhaust.png', 8, 8),

        init: function(x, y, settings) {

            this.parent(x, y, settings);

            // Where ever this unit is spawned, center over that point.
            this.pos.x -= this.size.x/2;
            this.pos.y -= this.size.y/2;

            this.rotate_timer = new ig.Timer();

            this.addAnim('fade', 0.25, [0, 1, 2, 2], true);

        },

        update: function() {
            this.parent();

            if(this.rotate_timer.delta() >= 1 / this.rotate_rate) {
                this.anims.fade.angle += this.rotate_degree;
                this.rotate_timer.set(0);
            }

            // Kill when animation has played.
            if( this.anims.fade.frame === 3 ) this.kill();

        }

    });

});