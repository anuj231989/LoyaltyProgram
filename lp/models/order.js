/**
 * Created by Suchishree Jena on 11/9/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userid: {type:Schema.Types.ObjectId, ref:'customer'},
    items: {type:Schema.Types.ObjectId, ref:'item', required:true},
    orderDate: {type: String},
    pointsRedeemed :{type: Number}
});

module.exports = mongoose.model('Order', OrderSchema);

