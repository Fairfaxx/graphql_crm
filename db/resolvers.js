const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const createToken = (user, secret, expire) => {
  const { id, name, email, lastname } = user;
  return jwt.sign({ id, name, email, lastname }, secret, { expiresIn: expire });
};

//Resolvers
const resolvers = {
  Query: {
    getUser: async (_, { token }) => {
      const userId = await jwt.verify(token, process.env.SECRET);
      return userId;
    },
  },
  Mutation: {
    newUser: async (_, { input }, ctx) => {
      const { email, password } = input;
      //User already exists?
      const existingUser = await User.findOne({ email });
      console.log(existingUser);
      if (existingUser) {
        throw new Error('User already exists');
      }
      //Hashear password
      const salt = await bcrypt.genSalt(10);
      input.password = await bcrypt.hash(password, salt);

      //Save user to database
      try {
        const user = new User(input);
        user.save(); //saving user
        return user;
      } catch (error) {
        throw new Error('Error creating user');
      }
    },
    authUser: async (_, { input }, ctx) => {
      const { email, password } = input;
      //Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      //Check password
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        throw new Error('Password is incorrect');
      }
      //Create token
      return {
        token: createToken(user, `${process.env.SECRET}`, '1h'),
      };
    },
  },
};
module.exports = resolvers;
