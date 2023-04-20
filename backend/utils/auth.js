const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// function to generate token
function generateToken(userId){
    return jwt.sign({userId}, '7432179417743294917508547391028393321469319800285376886682131708131379949611576377659258121094947976', {expiresIn: '1h'});
}

const comparePassword = async (enteredPassword, storedPassword) => {
    return await bcrypt.compare(enteredPassword, storedPassword);
};


module.exports.generateToken = generateToken;
module.exports.comparePassword = comparePassword;
