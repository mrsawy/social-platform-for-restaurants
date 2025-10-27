import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { abortOnError: false });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );


  const port = process.env.PORT || 3000;


  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Pleny Restaurant API')
    .setDescription(
      `## Pleny - The Social Network for Foodies 🍽️

### Overview
Welcome to the Pleny Restaurant Management API. This comprehensive API allows you to:
- Manage restaurants and their cuisines
- Handle user preferences and follows
- Get personalized restaurant recommendations
- Find nearby restaurants using geospatial queries

### Features
- **Restaurant Management**: Create, update, and manage restaurant profiles
- **Cuisine System**: Admin-managed cuisine categories for consistency
- **User Preferences**: Users can set their favorite cuisines
- **Social Features**: Follow restaurants and see what others are following
- **Smart Recommendations**: Get restaurant suggestions based on similar users' preferences
- **Location-Based Search**: Find restaurants within a specific radius
- **Advanced Filtering**: Filter restaurants by multiple cuisines with pagination

### Tech Stack
- NestJS with TypeScript
- MongoDB with Mongoose ODM
- MongoDB Geospatial Queries
- MongoDB Aggregation Pipelines

### Database
Make sure MongoDB is running and the connection string is configured in your .env file.
      `,
    )
    .setVersion('1.0')
    .setContact(
      'Pleny Support',
      'https://pleny.com',
      'support@pleny.com',
    )
    .addServer('http://localhost:3000', 'Local Development Server')
    .addServer('https://api.pleny.com', 'Production Server')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Pleny API Documentation',
    customfavIcon: 'https://pleny.com/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 50px 0 }
      .swagger-ui .info .title { font-size: 36px; color: #2c3e50 }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
    },
  });

  await app.listen(port ?? 3000);


  console.log('\n🚀 Application is running!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Server: http://localhost:${port}`);
  console.log(`📚 Swagger Docs: http://localhost:${port}/api/docs`);
  console.log(`📊 API Health: http://localhost:${port}/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}




bootstrap();
