const { gql } = require('apollo-server');

//Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    lastname: String
    email: String
    created: String
  }

  type Product {
    id: ID!
    name: String!
    stock: Int!
    price: Float!
    created: String
  }

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastname: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  type Query {
    #Get user
    getUser(token: String!): User

    #Get products
    getProducts: [Product]
    #Get one product
    getProduct(id: ID!): Product
  }

  type Mutation {
    #User
    newUser(input: UserInput): User
    authUser(input: AuthInput): Token

    #Product
    newProduct(input: ProductInput): Product
    #Update product
    updateProduct(id: ID!, input: ProductInput): Product
    #Delete product
    deleteProduct(id: ID!): String
  }
`;

module.exports = typeDefs;
