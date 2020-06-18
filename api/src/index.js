const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
require('dotenv').config();

const db = require('./db');
const models = require('./models');

// Run the server on a port specified in our .env file or port 4004
const port = process.env.PORT || 4004;
const DB_HOST = process.env.DB_HOST;

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
	type Book {
		id: ID!
		title: String!
		author: String!
	}

  type Query {
    hello: String!
    books: [Book!]!
    book(id: ID!): Book!
  }
  
  type Mutation {
    newBook(title: String!): Book
  }
`;

// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!', 
    books: async () => {
    	return await models.Book.find();
    }, 
    book: async (parent, args) => {
    	return await models.Book.findById(args.id);
    }
  }, 
  Mutation: {
    newBook: (parent, args) => {
      let bookValue = {
        id: String(books.length + 1),
        title: args.title,
        author: 'John Doe'
      };
      books.push(bookValue);
      return bookValue;
    }
  }
};

const app = express();

// Connect to the database
db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);