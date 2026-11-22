/**
 * Fastify JSON Schemas for /api/tasks endpoints
 * Uses JSON Schema draft-07 validated by Fastify's Ajv engine.
 */

// Schema for POST /api/tasks
export const createTaskSchema = {
  description: 'Create a new task',
  tags: ['Tasks'],
  body: {
    type: 'object',
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        description: 'Task title (required, 1-255 characters)'
      },
      description: {
        type: ['string', 'null'],
	maxLength: 5000,
        description: 'Optional detailed description of the task'
      },
      status: {
        type: 'string',
        enum: ['pending', 'completed'],
        default: 'pending',
        description: 'Task status: pending or completed'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
        description: 'Task priority: low, medium, or high'
      },
      due_date: {
        type: ['string', 'null'],
        format: 'date-time',
        description: 'Optional due date in ISO 8601 format'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'UUID of the user who owns this task'
      }
    },
    additionalProperties: false
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            priority: { type: 'string' },
            due_date: { type: ['string', 'null'] },
            created_at: { type: 'string' },
            updated_at: { type: 'string' }
          }
        }
      }
    }
  }
};

// Schema for GET /api/tasks
export const getTasksSchema = {
  description: 'Retrieve all tasks with optional filtering',
  tags: ['Tasks'],
  querystring: {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['pending', 'completed'],
        description: 'Filter by task status'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        description: 'Filter by task priority'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'Filter by user UUID'
      },
      search: {
        type: 'string',
        maxLength: 100,
        description: 'Search string for title or description'
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 50,
        description: 'Pagination limit'
      },
      offset: {
        type: 'integer',
        minimum: 0,
        default: 0,
        description: 'Pagination offset'
      }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        count: { type: 'integer' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              user_id: { type: 'string', format: 'uuid' },
              title: { type: 'string' },
              description: { type: ['string', 'null'] },
              status: { type: 'string' },
              priority: { type: 'string' },
              due_date: { type: ['string', 'null'] },
              created_at: { type: 'string' },
              updated_at: { type: 'string' },
              user_name: { type: ['string', 'null'] },
              user_email: { type: ['string', 'null'] }
            }
          }
        }
      }
    }
  }
};

// Schema for GET /api/tasks/:id
export const getTaskByIdSchema = {
  description: 'Retrieve a single task by ID',
  tags: ['Tasks'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Task UUID'
      }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            priority: { type: 'string' },
            due_date: { type: ['string', 'null'] },
            created_at: { type: 'string' },
            updated_at: { type: 'string' },
            user_name: { type: ['string', 'null'] },
            user_email: { type: ['string', 'null'] }
          }
        }
      }
    }
  }
};

// Schema for PUT /api/tasks/:id
export const updateTaskSchema = {
  description: 'Update an existing task by ID',
  tags: ['Tasks'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Task UUID'
      }
    },
    additionalProperties: false
  },
  body: {
    type: 'object',
    minProperties: 1,
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
        description: 'Task title (1-255 characters)'
      },
      description: {
        type: ['string', 'null'],
	maxLength: 5000,
        description: 'Task description'
      },
      status: {
        type: 'string',
        enum: ['pending', 'completed'],
        description: 'Task status: pending or completed'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        description: 'Task priority: low, medium, or high'
      },
      due_date: {
        type: ['string', 'null'],
        format: 'date-time',
        description: 'Due date in ISO 8601 format'
      },
      user_id: {
        type: 'string',
        format: 'uuid',
        description: 'Reassign task to another user UUID'
      }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            priority: { type: 'string' },
            due_date: { type: ['string', 'null'] },
            created_at: { type: 'string' },
            updated_at: { type: 'string' }
          }
        }
      }
    }
  }
};

// Schema for DELETE /api/tasks/:id
export const deleteTaskSchema = {
  description: 'Delete a task by ID',
  tags: ['Tasks'],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'Task UUID to delete'
      }
    },
    additionalProperties: false
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            user_id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: ['string', 'null'] },
            status: { type: 'string' },
            priority: { type: 'string' }
          }
        }
      }
    }
  }
};
