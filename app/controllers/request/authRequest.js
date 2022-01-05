const Validator = require('validatorjs')
const User = require('../../models/User')

module.exports = {
    login: async (req) => {
        let rules = {
            username: 'required',
            password: 'required'
        };
        
        let validation = new Validator(req.body, rules)
        if (validation.fails()) {
            return validation.errors.errors
        }
    },
    register: async (req) => {
        let rules = {
            email: 'required|max:50',
            name: 'required|max:50',
            username: 'required|alpha_num|min:6|max:20',
            password: 'required|confirmed|min:6'
        };
        
        let validation = new Validator(req.body, rules)
        if (validation.fails()) {
            return validation.errors.errors
        }
    },
}
//
// const validate = async (req) => {
//     let rules = {
//         username: 'required',
//         password: 'required'
//     };
    
//     let validation = new Validator(req.body, rules)
//     if (validation.fails()) {
//         return validation.errors.errors
//     }
// }
// module.exports = {
//     validate
// }