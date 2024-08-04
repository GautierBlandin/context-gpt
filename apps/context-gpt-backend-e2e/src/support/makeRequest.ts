// Helper function to make API requests
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8000/api';

export const makeRequest = async ({
  endpoint,
  method = 'GET',
  data,
  isSSE = false,
}: {
  endpoint: string;
  method?: 'GET' | 'POST';
  data?: any;
  isSSE?: boolean;
}) => {
  const headers: Record<string, string> = {};

  try {
    if (isSSE) {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        headers,
        responseType: 'stream',
      });

      return new Promise((resolve, reject) => {
        let fullResponse = '';
        response.data.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString();
          const lines = chunkStr.split('\n\n');
          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              const jsonStr = line.slice(6);
              if (jsonStr !== '[DONE]') {
                const jsonData = JSON.parse(jsonStr);
                fullResponse += jsonData.content;
              }
            }
          });
        });
        response.data.on('end', () => resolve(fullResponse.trim()));
        response.data.on('error', reject);
      });
    } else {
      const response = await axios({
        method,
        url: `${API_URL}${endpoint}`,
        data,
        headers,
      });
      return response.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
