ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.debug.debug',
    'plugins.empika.debug_display',
    'game.entities.player'
)
.defines(function(){

MyGame = ig.Game.extend({

    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),

    sortBy: ig.Game.SORT.Z_INDEX,
    autoSort: true,

    init: function() {

        // Make mouse information available.
        ig.input.initMouse();

        this.player = this.spawnEntity(EntityPlayer, 50, 50);

        this.debugDisplay = new DebugDisplay( this.font );
    },

    update: function() {
        // Update all entities and backgroundMaps
        this.parent();

        // Add your own, additional update code here
    },

    draw: function() {
        this.parent();

        // this.debugDisplay.draw(info, display_fps, display_average, average_time, interval_count)
        // info, array:                         this will display each array element on a new line
        // display_fps, bool:               pass in true or false to either show the FPS or not. defaults to true
        // display_average, bool:   pass in true or false to either show the average FPS over a period of time or not.
        //                                                  defaults to false
        // average_time, integer:   amount of of time between samples. defaults to 10000 (10 seconds)
        // interval_count, integer: amount of samples to take over time. defaults to 500
        var player_angle_in_degrees = this.player.angle_in_radians * 180/Math.PI;
        var debug_array = [
            'player.angle_in_radians: ' + this.player.angle_in_radians.toPrecision(3),
            'player.angle_in_degrees: ' + player_angle_in_degrees.toPrecision(3),
            'player.distance_to_target: ' + this.player.distance_to_target
        ];
        this.debugDisplay.draw(debug_array, false);
    }
});

ig.main( '#canvas', MyGame, 60, 480, 320, 2 );

});
