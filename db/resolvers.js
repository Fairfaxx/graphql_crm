const User = require('../models/User');
const Product = require('../models/Product');
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
    //Get all the products
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    //Get one product
    getProduct: async (_, { id }) => {
      //Check if the product exists
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
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
    //Create a new Product
    newProduct: async (_, { input }, ctx) => {
      try {
        const product = new Product(input);
        // save to DB
        const result = await product.save();
        return result;
      } catch (error) {
        throw new Error('Error creating product');
        console.error(error);
      }
    },
    // Update a product
    updateProduct: async (_, { id, input }, ctx) => {
      let product = await Product.findById(id);
      try {
        //Find product by id
        product = await Product.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return product;
      } catch (error) {
        throw new Error('Error updating product');
      }
    },
    // Delete a product
    deleteProduct: async (_, { id }, ctx) => {
      let product = await Product.findById(id);
      try {
        //Find product by id
        product = await Product.findOneAndDelete({ _id: id });
        return 'Product deleted';
      } catch (error) {
        throw new Error('Error deleting product');
      }
    },
  },
};
module.exports = resolvers;
