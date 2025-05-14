// mintToken.js
// This is a serverless function that handles token minting for the Meme Vault application

// Updated SDK initialization wrapped in a promise
import { Connection } from "@solana/web3.js";
import { initGoFundMemeSDK } from "@gofundmeme/sdk-frontend";
const gfmSDKPromise = (async () => {
  const connection = new Connection("https://api.mainnet-beta.solana.com");
  return await initGoFundMemeSDK({ connection });
})();

// Function to validate GoFundMeme URLs
const isValidGofundmemeUrl = (url) => {
  // Validate that the URL is from gofundmeme.io with the expected format
  const regex = /^https:\/\/www\.gofundmeme\.io\/campaigns\/[A-Za-z0-9]{43,44}$/;
  return regex.test(url);
};

// The serverless function handler
export const handler = async function(event) {
  // Handle CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }
  
  try {
    // Parse the request body and validate memeUrl
    const { memeUrl } = JSON.parse(event.body);
    if (!memeUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: 'A valid meme URL is required' })
      };
    }
    if (!isValidGofundmemeUrl(memeUrl)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Only GoFundMeme URLs are accepted (format: https://www.gofundmeme.io/campaigns/...)' 
        })
      };
    }
    
    // Await the SDK initialization
    const gfmSDK = await gfmSDKPromise;
    if (!gfmSDK) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "SDK initialization failed" })
      };
    }
    
    // Call the GFM SDK to create a token bond
    const tokenResponse = await gfmSDK.createTokenBond({
      name: 'Meme Token',
      description: `Token for meme: ${memeUrl}`,
      imageUrl: memeUrl,
      // In a real implementation, you would include other required parameters
      // such as recipient wallet address, token amount, etc.
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: true, data: tokenResponse })
    };
    
  } catch (error) {
    console.error('Token minting error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ success: false, error: `Error occurred during token minting process: ${error.message}` })
    };
  }
};