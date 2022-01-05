const User = require('../models/User')

module.exports = {
    
    profile: async (req, res) => {

        let user = await User.findByPk(req.user.id)

        if (user == null) { 
            return res.status(404).json({
                status: false,
                msg: 'Pengguna tidak di temukan'
            }) 
        } 

        return res.status(200).json({
            status: true,
            msg: 'Login berhasil',
            data: user
        }) 
    }
}