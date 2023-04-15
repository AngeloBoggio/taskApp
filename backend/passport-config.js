const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');


const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: '7432179417743294917508547391028393321469319800285376886682131708131379949611576377659258121094947976',
};

passport.use(
    new JwtStrategy(opts, async(jwt_payload, done) => {
        try{
            const user = await User.findById(jwt_payload.userId);

            if(!user) {
                return done(null, false);
            }

            return done(null,user);
        } catch (err) {
            return done(err,false);
        }
    })
);


module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async function(username,password,done){
      try {
        const user = await User.findOne({username:username});
        if(!user){
            return done(null,false);
        }
        const isMatch = await user.validPassword(password);
        if(!isMatch){
            return done(null,false);
        }
        return done(null,user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
passport.serializeUser((user, done) => {
    done(null, user.id);
});
  
passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};


