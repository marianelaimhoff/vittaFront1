import { fetchWithToken } from "../app/utils/fetchWithToken"; // Adjust the import path as necessary

export const handleImageUpload = async (file: File, userId: string) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetchWithToken(`${process.env.NEXT_PUBLIC_API_URL}/files/uploadImage/${userId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    throw error;
  }
};

  