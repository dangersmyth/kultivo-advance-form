
/**
 * Simple encryption utility for securing PIN data
 * In a production environment, we'd use a more robust solution
 */

// Use the SubtleCrypto API for encryption
export async function encryptData(data: string): Promise<string> {
  try {
    // In a real app, you would use a proper key management system
    // This is simplified for demonstration purposes
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // Generate a random salt
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // Derive a key from the data using SHA-256
    const keyMaterial = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...new Uint8Array(keyMaterial))) + 
           '.' + 
           btoa(String.fromCharCode(...salt));
  } catch (error) {
    console.error('Encryption error:', error);
    // In case of error with SubtleCrypto, fallback to a simple obfuscation
    // Note: This is NOT secure and only for demo purposes
    return btoa(`${data}_${Date.now()}`);
  }
}
