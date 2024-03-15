import React, { useState } from 'react';

function UploadImageComponent() {
  const [uploadedImage, setUploadedImage] = useState<null | string>(null); // Ajout du type null | string pour uploadedImage
  const apiUrl = 'https://freeimage.host/api/1/upload';
  const apiKey = '6d207e02198a847aa98d0a2a901485a5';

  const onImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // Ajout du type pour event
    const selectedFile = event.target.files?.[0]; // Utilisation de ?. pour éviter l'erreur si files est null ou undefined
    if (!selectedFile || selectedFile.type.split('/')[0] !== 'image') {
      return;
    }

    const imageUrl = URL.createObjectURL(selectedFile); // Création de l'URL de l'image

    setUploadedImage(imageUrl); // Mise à jour de l'état avec l'URL de l'image

    const formData = new FormData();
    formData.append('source', selectedFile);
    formData.append('format', 'json');

    try {
      const response = await fetch(`${apiUrl}/?key=${apiKey}&action=upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log('data', data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onImageSelected} />
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
      <button type="button">Upload</button>
    </div>
  );
}

export default UploadImageComponent;
