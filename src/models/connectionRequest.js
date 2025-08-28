const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String, 
        required: true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect.`
        }
    }
},{ timestamps: true });

connectionRequestSchema.index({fromUserID: 1, toUserID: 1});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);