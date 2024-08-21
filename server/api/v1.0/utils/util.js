
const bcrypt = require("bcrypt");

let encryptPassword = password => {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

let decryptPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};



module.exports = {
    encryptPassword,
    decryptPassword
};