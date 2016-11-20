
// Attach metadata to entities
// When updated, when and by whom
// When created, when and by whom
// Supports soft-delete, when and by whom
// By default, this will be stored by the entity itself
// In the future, an option to attach it to a specific table may be possible to log "any" interaction

// By default, it'll use the save$ act to hook on.
// For performance, you can also specify specific act to avoid checking upon every save of your instance of seneca-entity
var entities = [];

module.exports = function entityTracker (options) {
  entities = options.entities;
  var seneca = this;
  console.log('export');
  seneca.wrap({cmd: 'save', role: 'entity'}, save);
  seneca.wrap({cmd: 'remove', role: 'entity'}, remove);
  seneca.wrap({role: 'entity', cmd: 'save', ent: '*', name: 'color'}, test);
  return {
    name: 'entity-tracker'
  };
};

function remove (args, cb) {
  var cmd = {role: 'entity', cmd: 'save'};
  args.ent.deleted_at = new Date();
  cmd.ent = args.ent;
  cmd.name = args.name;
  this.act(cmd, cb);
}

function save (args, cb) {
  var date = new Date();
  if (args.ent.id) {
    args.ent.updated_at = date;
  } else {
    args.ent.created_at = date;
  }
  console.log(args.ent);
  this.prior(args, cb);
}

function test (args, cb) {
  console.log('test', args);
  this.prior(args, cb);
}
