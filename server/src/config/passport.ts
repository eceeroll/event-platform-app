import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";
import User from "../models/User";

passport.use(
  new LocalStrategy(async (username: string, password: string, done: any) => {
    try {
      console.log("Login attempt with username:", username);
      const user = await User.findOne({ where: { username } });

      if (!user) {
        console.log("User not found");
        return done(null, false, { message: "Kayıtlı kullanıcı bulunamadı." });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Password incorrect");
        return done(null, false, {
          message: "Kullanıcı adı veya parola yanlış.",
        });
      }
      console.log("Login successful");
      return done(null, user);
    } catch (err) {
      console.error("Error during authentication:", err);
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    console.error("Error during deserialization:", err);
    done(err);
  }
});

export default passport;
