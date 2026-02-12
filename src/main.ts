import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { apiReference } from "@scalar/nestjs-api-reference"
import { ValidationPipe } from "@nestjs/common"
import cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api")

  const config = new DocumentBuilder()
    .setTitle("Schedule API")
    .setDescription("The schedule API description")
    .setVersion("1.0")
    .addTag("schedule")
    .build()
  const document = SwaggerModule.createDocument(app, config)
  app.use("/docs", apiReference({ content: document, theme: "default" }))

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  )

  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
