const bcrypt = require('bcryptjs')

module.exports = {
    make: async (string) => {
        let salt = await bcrypt.genSalt()
        let hashed = await bcrypt.hash(string, salt)

        return hashed
    }
}