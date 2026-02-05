/**
 * BuildBrief API Server
 * Enhanced with validation, error handling, rate limiting, and structured logging
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';

import { stateManager } from './state';
import { getNextStep } from './openrouter';
import { logger } from './logger';
import { 
  AppError, 
  ValidationError, 
  NotFoundError, 
  errorHandler, 
  notFoundHandler,
  asyncHandler 
} from './errors';
import { aiRateLimiter, standardRateLimiter } from './rateLimiter';
import { 
  requestIdMiddleware, 
  requestLoggerMiddleware, 
  securityHeadersMiddleware,
  RequestWithContext 
} from './middleware';
import { 
  initProjectSchema, 
  answerSchema, 
  refineSchema,
  projectIdParamSchema 
} from './validation';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Application state
let serverStartTime = Date.now();

// Security middleware
app.use(securityHeadersMiddleware);
app.use(requestIdMiddleware);
app.use(requestLoggerMiddleware);

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Request-Id'],
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '1mb' }));

/**
 * Health check endpoint
 */
app.get('/health', standardRateLimiter, (req: Request, res: Response) => {
  const uptime = Date.now() - serverStartTime;
  const memory = process.memoryUsage();
  
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime,
    memory: {
      used: Math.round(memory.heapUsed / 1024 / 1024),
      total: Math.round(memory.heapTotal / 1024 / 1024)
    }
  });
});

/**
 * Root endpoint
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'BuildBrief API',
    version: '1.0.0',
    status: 'running',
    documentation: '/health'
  });
});

/**
 * Initialize project endpoint
 * POST /api/init
 */
app.post('/api/init', 
  aiRateLimiter,
  asyncHandler(async (req: RequestWithContext, res: Response) => {
    // Validate input
    const validationResult = initProjectSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid project idea',
        { issues: validationResult.error.issues }
      );
    }

    const { idea } = validationResult.data;

    logger.info('Creating new project', { ideaLength: idea.length }, req.requestId);

    // Create session
    const projectId = stateManager.createSession(idea);
    const currentState = stateManager.getSession(projectId);

    if (!currentState) {
      throw new AppError(500, 'Failed to create session', 'SESSION_CREATION_FAILED');
    }

    // Get first question from AI
    logger.info('Requesting initial question from AI', {}, req.requestId);
    const firstStep = await getNextStep(currentState, `My idea is: ${idea}`);

    if (firstStep.type === 'error') {
      throw new AppError(502, 'AI service returned an error', 'AI_ERROR');
    }

    // Update state
    const updates = {
      ...(firstStep.project_state_updates || {}),
      history: [...currentState.history, { question: 'INITIAL_IDEA', answer: idea }]
    };

    stateManager.updateSession(projectId, updates);

    // Set progress
    firstStep.progress = { current: 1, total: 10 };

    logger.info('Project initialized successfully', { projectId }, req.requestId);

    res.status(201).json({
      success: true,
      data: { projectId, step: firstStep },
      requestId: req.requestId
    });
  })
);

/**
 * Submit answer endpoint
 * POST /api/answer
 */
app.post('/api/answer', 
  aiRateLimiter,
  asyncHandler(async (req: RequestWithContext, res: Response) => {
    // Validate input
    const validationResult = answerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid answer submission',
        { issues: validationResult.error.issues }
      );
    }

    const { projectId, answer } = validationResult.data;

    // Get session
    const currentState = stateManager.getSession(projectId);
    if (!currentState) {
      throw new NotFoundError('Project', projectId);
    }

    logger.info('Processing answer', { 
      projectId, 
      historyLength: currentState.history.length 
    }, req.requestId);

    // Record answer in history
    const updatedHistory = [
      ...currentState.history, 
      { question: 'AI_QUESTION', answer }
    ];
    stateManager.updateSession(projectId, { history: updatedHistory });

    // Get next step from AI
    const stateWithHistory = stateManager.getSession(projectId)!;
    const nextStep = await getNextStep(stateWithHistory, answer);

    if (nextStep.type === 'error') {
      throw new AppError(502, 'AI service returned an error', 'AI_ERROR');
    }

    // Update project state
    if (nextStep.project_state_updates) {
      stateManager.updateSession(projectId, nextStep.project_state_updates);
    }

    // Calculate dynamic progress
    const ideaLength = (stateWithHistory.idea_summary || '').length;
    const hasMultipleRoles = (stateWithHistory.resolved_decisions?.user_roles || '').includes(',');
    const hasIntegrations = (stateWithHistory.resolved_decisions?.integrations || []).length > 0;
    
    let dynamicLimit = 5;
    if (ideaLength > 100) dynamicLimit += 1;
    if (hasMultipleRoles) dynamicLimit += 2;
    if (hasIntegrations) dynamicLimit += 2;
    dynamicLimit = Math.min(dynamicLimit, 10);

    const finalHistory = stateManager.getSession(projectId)?.history || [];
    nextStep.progress = {
      current: finalHistory.length + 1,
      total: dynamicLimit
    };

    logger.info('Answer processed', { 
      projectId, 
      progress: nextStep.progress 
    }, req.requestId);

    res.json({
      success: true,
      data: { step: nextStep },
      requestId: req.requestId
    });
  })
);

/**
 * Refine project endpoint
 * POST /api/refine
 */
app.post('/api/refine', 
  aiRateLimiter,
  asyncHandler(async (req: RequestWithContext, res: Response) => {
    // Validate input
    const validationResult = refineSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid refinement request',
        { issues: validationResult.error.issues }
      );
    }

    const { projectId, comments } = validationResult.data;

    // Get session
    const currentState = stateManager.getSession(projectId);
    if (!currentState) {
      throw new NotFoundError('Project', projectId);
    }

    logger.info('Processing refinement', { projectId }, req.requestId);

    // Create state with refinement
    const stateWithRefinement = {
      ...currentState,
      history: [...currentState.history, { question: 'USER_REFINEMENT', answer: comments }]
    };

    // Get refined output from AI
    const nextStep = await getNextStep(stateWithRefinement, 'GENERATE_REFINED_OUTPUT');

    if (nextStep.type === 'error') {
      throw new AppError(502, 'AI service returned an error', 'AI_ERROR');
    }

    // Update state
    stateManager.updateSession(projectId, {
      history: stateWithRefinement.history
    });

    logger.info('Refinement completed', { projectId }, req.requestId);

    res.json({
      success: true,
      data: { step: nextStep },
      requestId: req.requestId
    });
  })
);

/**
 * Get project endpoint
 * GET /api/project/:id
 */
app.get('/api/project/:id', 
  standardRateLimiter,
  asyncHandler(async (req: RequestWithContext, res: Response) => {
    // Validate project ID
    const validationResult = projectIdParamSchema.safeParse({ id: req.params.id });
    
    if (!validationResult.success) {
      throw new ValidationError(
        'Invalid project ID',
        { issues: validationResult.error.issues }
      );
    }

    const { id } = validationResult.data;
    const state = stateManager.getSession(id);
    
    if (!state) {
      throw new NotFoundError('Project', id);
    }

    res.json({
      success: true,
      data: state,
      requestId: req.requestId
    });
  })
);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`BuildBrief API Server running on http://localhost:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.OPENROUTER_API_KEY) {
    logger.warn('OPENROUTER_API_KEY is not set - AI calls will fail');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Uncaught error handlers
process.on('uncaughtException', (error) => {
  logger.fatal('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal('Unhandled rejection', reason as Error);
  process.exit(1);
});
