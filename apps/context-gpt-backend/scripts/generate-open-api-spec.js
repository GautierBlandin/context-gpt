import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const url = 'http://localhost:8001/openapi-json';
const outputFile = './apps/context-gpt-backend/context-gpt.openapi.json';
const maxAttempts = 60; // Maximum number of attempts
const delayBetweenAttempts = 500; // Delay between attempts in milliseconds

async function fetchWithRetry(url, attempt = 1) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (attempt >= maxAttempts) {
      throw new Error(`Max attempts reached. Last error: ${error.message}`);
    }
    console.log(`Attempt ${attempt} failed. Retrying in ${delayBetweenAttempts / 1000} seconds...`);
    await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
    return fetchWithRetry(url, attempt + 1);
  }
}

async function fetchAndSaveJson() {
  try {
    console.log('Waiting for OpenAPI JSON to be available...');
    const data = await fetchWithRetry(url);

    // Prettify the JSON
    const prettifiedJson = JSON.stringify(data, null, 2);

    // Write to file
    const outputPath = path.resolve(outputFile);
    await fs.writeFile(outputPath, prettifiedJson, 'utf8');

    console.log(`JSON data has been prettified and saved to ${outputPath}`);
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1); // Exit with error code
  }
}

fetchAndSaveJson();
