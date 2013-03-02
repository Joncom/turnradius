ig.module('plugins.spawn-below')

.requires('impact.game')

.defines(function(){

    ig.Game.inject({

        spawnEntityBelow: function( type, x, y, settings ) {
            var entityClass = typeof(type) === 'string'
                ? ig.global[type]
                : type;

            if( !entityClass ) {
                throw("Can't spawn entity of type " + type);
            }
            var ent = new (entityClass)( x, y, settings || {} );
            this.entities.unshift( ent );
            if( ent.name ) {
                this.namedEntities[ent.name] = ent;
            }
            return ent;
        }

    });

});