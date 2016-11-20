var async = require('async');
var seneca = require('seneca')();
seneca.use('entity'); // Only for seneca > 2.0
seneca.use('basic'); // Only > 3.0


// node index.js --seneca.log.debug seneca>3.x
// node index.js --seneca.log.print seneca>v1.4

var color = seneca.make$('color');
var red = {name: 'red'};
seneca.ready(function(){
  seneca.use('..', {entities: ['color']});
  // seneca.wrap({cmd: 'save',role: 'entity'}, save);
  // seneca.wrap({role: 'entity', cmd: 'save', ent: '*', name: 'color'}, save);

  async.series([save1, load, save2, load, remove, load]);

  function save1 (sCb) {
    color.save$(red, function (err, entity) {
      console.log('entity created_at', entity.created_at);
      red = entity;
      sCb();
    });
  }

  function load (sCb) {
    color.load$({id: red.id}, function (err, entity) {
      console.log('red', Object.keys(entity));
      sCb();
    });
  }

  function save2 (sCb) {
    color.save$(red, function (err, entity) {
      console.log('entity updated_at', entity.updated_at);
      red = entity;
      sCb();
    });
  }

  function remove (sCb) {
    color.remove$({id: red.id}, function (err, entity) {
      console.log('entity deleted_at', entity.deleted_at);
      sCb();
    });
  }


  // function save (args, cb) {
  //   console.log('overwrite', args);
  //   this.prior(args, cb);
  // }

});
