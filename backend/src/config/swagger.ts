import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Form Engine API",
      version: "1.0.0",
      description: "API de Engine de Formulários Inteligentes",
    },
    servers: [{ url: "http://localhost:8080" }],
  },
  apis: ["./src/routes/*.ts"], // arquivos que contêm docstring @swagger
};

export const swaggerSpec = swaggerJSDoc(options);
