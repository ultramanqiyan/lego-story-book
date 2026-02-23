import { createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

export async function onRequestPost(context) {
  try {
    const { image, prompt } = await context.request.json();
    const result = await generateImage(context, image, prompt);
    return result;
  } catch (error) {
    return createErrorResponse('服务器错误，请重试', 500);
  }
}

async function generateImage(context, image, prompt) {
  const seedreamApiKey = getApiKey(context);
  const payload = buildPayload(image, prompt);

  const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${seedreamApiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    return handleApiError(response);
  }

  return handleSuccess(response);
}

function getApiKey(context) {
  return context.env.SEEDREAM_API_KEY || 'ee51832f-f233-45ec-9262-00e1d2a66ba1';
}

function buildPayload(image, prompt) {
  return {
    model: 'doubao-seedream-4-0-250828',
    prompt: prompt,
    image: image,
    sequential_image_generation: 'disabled',
    response_format: 'url',
    size: '1024x1024',
    stream: false,
    watermark: false
  };
}

async function handleApiError(response) {
  const errorData = await response.json();
  return createErrorResponse(errorData.error?.message || 'API调用失败', response.status);
}

async function handleSuccess(response) {
  const data = await response.json();
  const imageUrl = data.data[0].url;
  return createSuccessResponse({ imageUrl: imageUrl });
}
