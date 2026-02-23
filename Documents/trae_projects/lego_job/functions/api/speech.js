import { createErrorResponse, createSuccessResponse, handleCORS } from './utils.js';

export async function onRequestOptions(context) {
  return handleCORS();
}

export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const audioFile = formData.get('audio');

    if (!audioFile) {
      return createErrorResponse('没有收到音频文件', 400);
    }

    return await transcribeAudio(context, audioFile);
  } catch (error) {
    return createErrorResponse('语音识别服务错误', 500);
  }
}

async function transcribeAudio(context, audioFile) {
  const siliconflowApiKey = getApiKey(context);
  const audioFormData = buildAudioFormData(audioFile);

  const response = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${siliconflowApiKey}`
    },
    body: audioFormData
  });

  if (!response.ok) {
    return handleApiError(response);
  }

  return handleSuccess(response);
}

function getApiKey(context) {
  return context.env.SILICONFLOW_API_KEY || 'sk-zisdkmqynswnsnikguvbkegwyunykggaenzekxocuukeaotz';
}

function buildAudioFormData(audioFile) {
  const audioFormData = new FormData();
  audioFormData.append('model', 'FunAudioLLM/SenseVoiceSmall');
  audioFormData.append('file', audioFile);
  return audioFormData;
}

async function handleApiError(response) {
  const errorData = await response.json();
  return createErrorResponse(errorData.error?.message || '语音识别失败', response.status);
}

async function handleSuccess(response) {
  const data = await response.json();
  return createSuccessResponse({ text: data.text || '' });
}
