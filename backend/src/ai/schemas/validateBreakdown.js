
const VALID_STATUSES = [
  'READY',
  'NEEDS_CLARIFICATION',
  'INVALID_INPUT'
];

export function validateBreakdown(result) {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid AI response.');
  }

  if (!VALID_STATUSES.includes(result.status)) {
    throw new Error('Invalid response status.');
  }

  if (typeof result.message !== 'string') {
    throw new Error('Response message is required.');
  }

  if (!Array.isArray(result.subtasks)) {
    throw new Error('Subtasks must be an array.');
  }

  if (result.status !== 'READY') {
    if (result.subtasks.length !== 0) {
      throw new Error('Only READY responses can contain subtasks.');
    }

    if (
      result.status === 'NEEDS_CLARIFICATION' &&
      !result.clarificationQuestion
    ) {
      throw new Error('A clarification question is required.');
    }

    return result;
  }

  if (result.subtasks.length === 0) {
    throw new Error('A READY response must contain subtasks.');
  }

  for (const subtask of result.subtasks) {
    if (
      !subtask.title?.trim() ||
      !subtask.description?.trim() ||
      !subtask.completionCriteria?.trim()
    ) {
      throw new Error('Every subtask needs a title, description and completion criteria.');
    }

    if (
      subtask.estimatedMinutes !== null &&
      (!Number.isInteger(subtask.estimatedMinutes) ||
        subtask.estimatedMinutes <= 0)
    ) {
      throw new Error('Invalid subtask time estimate.');
    }

    if (!Array.isArray(subtask.resources)) {
      throw new Error('Subtask resources must be an array.');
    }
  }

  return result;
}
