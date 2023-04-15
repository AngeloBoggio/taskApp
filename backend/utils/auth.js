const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// function to generate token
function generateToken(userId){
    return jwt.sign({userId}, 'secret', {expiresIn: '1h'});
}

const comparePassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};


module.exports.generateToken = generateToken;
module.exports.comparePassword = comparePassword;
