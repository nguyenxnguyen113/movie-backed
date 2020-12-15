const conversation = require('../models/conversation')




exports.postConversation = (req, res) => {
    const { senderId, isImg, content } = req.body
    console.log(req.body);
}

exports.getAllConversation = (req, res) => {
    const { limit } = req.query
    let pipleline = [ {
        $sort:{
            createdAt:-1
        }
    }]
    if (limit) pipleline.push(
        {
            $limit: parseInt(limit)
        }
    )
    pipleline.push(...[
        {
        $lookup: {
            from: 'users',
            localField: 'senderId',
            foreignField: '_id',
            as: 'sender'
        }
    },
    {
        $project: {
            "senderId": 0,
            "sender.hash_password": 0
        }
    }
    ])
    console.log(pipleline);
    conversation.aggregate(pipleline).exec((err, con) => {
        if (err) res.status(500).json({ message: "server error" })
        else res.status(200).json(con)
    })
}