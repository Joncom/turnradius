ig.module('game.entities.player')

.requires('impact.entity', 'game.entities.exhaust', 'plugins.spawn-below')

.defines(function() {

    EntityPlayer = ig.Entity.extend({

        size: {
            x: 22,
            y: 22
        },

        offset: {
            x: 3,
            y: 0
        },

        zIndex: 10,
        speed: 300,
        angle_in_radians: 0,
        turn_timer: null, // regulates movement speed while turning
        turn_radius: 50,
        turn_center: { x: 0, y: 0 }, // center point of circle
        turn_start_angle: 0,
        is_turning: false,

        // spawns per second
        exhaust_rate: 20,
        exhaust_timer: new ig.Timer(),

        animSheet: new ig.AnimationSheet('media/player.png', 28, 22),

        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', 1, [0], true);
            this.turn_timer = new ig.Timer();
            this.maxVel.x = this.maxVel.y = this.speed; // Speed is the max speed.
        },

        update: function() {

            this.parent();

            // Spawn exhaust entities.
            if(this.exhaust_timer.delta() >= 1 / this.exhaust_rate) this.spawn_exhaust();

            var target_x = ig.input.mouse.x;
            var target_y = ig.input.mouse.y;

            var distance_to_target_x = target_x - this.pos.x - this.size.x / 2;
            var distance_to_target_y = target_y - this.pos.y - this.size.y / 2;
            this.distance_to_target = Math.floor( Math.sqrt( Math.pow(distance_to_target_x, 2) + Math.pow(distance_to_target_y, 2) ) );

            if( this.distance_to_target < 5 ) this.vel.x = this.vel.y = 0;
            else {

                var angle_to_target = this.angle_to_coord(target_x, target_y);
                if( this.angle_in_radians >= angle_to_target - 0.1 &&
                    this.angle_in_radians < angle_to_target + 0.1 ) {

                    this.is_turning = false;
                    this.angle_in_radians = angle_to_target;
                    this.move_toward_coord(ig.input.mouse.x, ig.input.mouse.y);

                } else {

                    if(!this.is_turning) {
                        this.is_turning = true;
                        this.turn_timer.set(0);
                        var direction_slope = Math.tan(this.angle_in_radians);
                        this.turn_start_angle = Math.atan2(1, -direction_slope);
                        var turn_center_x = this.pos.x + (this.size.x/2) - ( this.turn_radius * Math.cos(this.turn_start_angle) );
                        var turn_center_y = this.pos.y + (this.size.y/2) - ( this.turn_radius * Math.sin(this.turn_start_angle) );
                        this.turn_center = { x: turn_center_x, y: turn_center_y };
                    }

                    this.move_in_circle(false);

                }

            }

            this.currentAnim.angle = this.angle_in_radians;

        },

        angle_to_coord: function(x, y) {
            var delta_x = x - (this.pos.x + this.size.x / 2);
            var delta_y = y - (this.pos.y + this.size.y / 2);
            var angle_in_radians = Math.atan2(delta_y, delta_x);
            return angle_in_radians;
        },

        spawn_exhaust: function() {
            var x = -10, y = 0;
            var translated_x = x * Math.cos(this.angle_in_radians) - y * Math.sin(this.angle_in_radians);
            var translated_y = x * Math.sin(this.angle_in_radians) - y * Math.cos(this.angle_in_radians);
            var final_x = translated_x + this.pos.x + this.size.x / 2;
            var final_y = translated_y + this.pos.y + this.size.y / 2;
            ig.game.spawnEntityBelow(EntityExhaust, final_x, final_y);
            this.exhaust_timer.set(0);
        },

        move_in_circle: function(clockwise) {
            clockwise = ( typeof clockwise === "boolean" ? clockwise : true );
            var circumference = Math.PI * 2 * this.turn_radius;
            var cycles_per_second = this.speed / circumference;
            var theta = ( clockwise ? 1 : -1 ) * this.turn_timer.delta() * (2*Math.PI*cycles_per_second) + this.turn_start_angle;
            var x = Math.cos( theta ) * this.turn_radius;
            var y = Math.sin( theta ) * this.turn_radius;
            this.pos.x = this.turn_center.x + x - ( this.size.x / 2 );
            this.pos.y = this.turn_center.y + y - ( this.size.y / 2 );
            // The slope of the radius is y/x. Take the negative reciprocal.
            // Where the negative -1 goes depends on the direction.
            this.angle_in_radians = Math.atan2( (clockwise ? 1 : -1) * x, (clockwise ? -1 : 1) * y); // uses the negative reciprocal of the slope of the radius
        },

        move_toward_coord: function(x, y) {
            var distance_x = x - this.pos.x - this.size.x / 2;
            var distance_y = y - this.pos.y - this.size.y / 2;
            if(Math.abs(distance_x) > 1 || Math.abs(distance_y) > 1) {
                this.vel.x = (distance_x > 1 ? 1 : -1) * this.speed * (Math.abs(distance_x) / (Math.abs(distance_x) + Math.abs(distance_y)));
                this.vel.y = (distance_y > 1 ? 1 : -1) * this.speed * (Math.abs(distance_y) / (Math.abs(distance_x) + Math.abs(distance_y)));
            }
        }

    });

});