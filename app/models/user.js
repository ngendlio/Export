var mongoose =require('mongoose');
var Schema =mongoose.Schema;
// On cree le schema d'un utilisateur normal
var userSchema =new Schema({
	'facebook': {
		id:{type:String,required:true,unique:true},
		name :{type:String,required:true},
		token:{type:String,required:true},
		lastUpdate:{type:Date}
	}
});

userSchema.pre('save',function(next){
	this.inscription = new Date();
	next();
})

var User =mongoose.model('User',userSchema);

exports.UserModel =User;