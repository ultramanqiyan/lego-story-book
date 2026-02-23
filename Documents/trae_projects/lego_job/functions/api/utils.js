export function generateId() {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
}

export function createResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createErrorResponse(message, status = 500) {
  return createResponse({ success: false, error: message }, status);
}

export function createSuccessResponse(data) {
  return createResponse({ success: true, ...data });
}
