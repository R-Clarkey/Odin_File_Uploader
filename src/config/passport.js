const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const { prisma } = require("../db/prisma");

function configurePassport(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return done(null, false, { message: "Invalid login" });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return done(null, false, { message: "Invalid login" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = configurePassport;
