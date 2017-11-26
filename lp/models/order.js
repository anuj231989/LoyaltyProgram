/**
 * Created by Suchishree Jena on 11/9/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userid: {type:Schema.Types.ObjectId, ref:'customer'},
    items: {type:Object, required:true},
	address: {type:String, required:true}
});

module.exports = mongoose.model('Order', OrderSchema);

