type FetchOptions = RequestInit & { parseJson?: boolean };

const apiURL = import.meta.env.VITE_API_URL

export async function customFetch<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const URL = `${apiURL}/${endpoint}`
    const response = await fetch(URL, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message ?? JSON.stringify(errorData);
      } catch (error) {
        console.error('Non-ok response: ', { error })
      }

      throw new Error(errorMessage);
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('Request failed: ', { error })
    throw error;
  }
}
