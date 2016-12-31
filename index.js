
// Attach metadata to entities
// When updated, when and by whom
// When created, when and by whom
// Supports soft-delete, when and by whom
// By default, this will be stored by the entity itself
// In the future, an option to attach it to a specific table may be possible to log "any" interaction

// By default, it'll use the save$ act to hook on.
// For performance, you can also specify specific act to avoid checking upon every save of your instance of seneca-entity

module.exports = function entityTracker (options) {
  var entities = [];
  entities = options.entities;
  var seneca = this;
  if (!entities || entities.length === 0) {
    throw(new Error('Entities to track undefined'));
  }
  entities.forEach(function (entity) {
    seneca.add({ role: 'entity', cmd: 'save', name: entity }, save);
    seneca.add({ role: 'entity', cmd: 'remove', name: entity }, remove);
  });
  return {
    name: 'entity-tracker'
  };
};

function remove (args, cb) {
  var cmd = { role: 'entity', cmd: 'save' };
  if (!args.ent.deleted_at) {
    args.ent.deleted_at = new Date();
  }
  cmd.ent = args.ent;
  cmd.name = args.name;
  this.act(cmd, cb);
}

function save (args, cb) {
  var date = new Date();
  // Always clear up created_at fields, it shouldn't be handled by the user
  if (!args.ent.deleted_at) {
    delete args.ent.created_at;
    delete args.ent.deleted_at;
    if (args.ent.id) {
      args.ent.updated_at = date;
    } else {
      args.ent.created_at = date;
    }
  }
  this.prior(args, cb);
}
