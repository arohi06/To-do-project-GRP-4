
export const TASK_BREAKDOWN_SCHEMA = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['READY', 'NEEDS_CLARIFICATION', 'INVALID_INPUT']
    },
    message: {
      type: 'string'
    },
    clarificationQuestion: {
      type: ['string', 'null']
    },
    taskCategory: {
      type: ['string', 'null']
    },
    expectedOutcome: {
      type: ['string', 'null']
    },
    complexity: {
      type: ['string', 'null'],
      enum: ['simple', 'moderate', 'complex', null]
    },
    subtasks: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          completionCriteria: { type: 'string' },
          estimatedMinutes: {
            type: ['integer', 'null']
          },
          resources: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                type: { type: 'string' },
                url: { type: 'string' }
              },
              required: ['title', 'type', 'url'],
              additionalProperties: false
            }
          }
        },
        required: [
          'title',
          'description',
          'completionCriteria',
          'estimatedMinutes',
          'resources'
        ],
        additionalProperties: false
      }
    }
  },
  required: [
    'status',
    'message',
    'clarificationQuestion',
    'taskCategory',
    'expectedOutcome',
    'complexity',
    'subtasks'
  ],
  additionalProperties: false
};
