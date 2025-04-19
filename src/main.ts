import express, {Response, Request} from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
dotenv.config();
import { Authrouter, projectRouter, taskRouter, UserRouter } from "./routes";
import { connectDB, redisClient, logger, connectRabbitMQ, swaggerSpec, consumeTaskQueue} from "./config";
import { initializeMailer } from "./notifications";

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/auth', Authrouter);
app.use('/users', UserRouter);
app.use('/projects', projectRouter);
app.use('/tasks', taskRouter);

const PORT = process.env.PORT || 5000;
const startServer = async (): Promise<void> => {
  try {
    await connectDB();          
    await redisClient.connect(); 
    await connectRabbitMQ();  
    consumeTaskQueue(); 
    initializeMailer();
    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
      logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
  }
};

startServer();