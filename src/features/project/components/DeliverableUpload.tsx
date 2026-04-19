import React, { useState } from 'react';
import { Button } from '../../../shared/ui/Button';

interface FileUploadProps {
  deliverableId: string;
  onUploadSuccess: (fileInfo: any) => void;
}

export const DeliverableUpload: React.FC<FileUploadProps> = ({ deliverableId, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!fileName) return;
    
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess({
        id: deliverableId,
        fileName,
        uploadedAt: new Date().toISOString(),
        status: 'COMPLETED'
      });
      alert(`\${fileName} 업로드 완료!`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-2 p-4 border-2 border-dashed rounded-lg text-center">
      <input 
        type="file" 
        id={`file-\${deliverableId}`}
        className="hidden" 
        onChange={handleFileChange}
      />
      <label 
        htmlFor={`file-\${deliverableId}`}
        className="cursor-pointer text-blue-500 hover:underline"
      >
        {fileName || '파일을 선택하거나 드래그하세요'}
      </label>
      <Button 
        size="sm" 
        disabled={!fileName || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? '업로드 중...' : '업로드 시작'}
      </Button>
    </div>
  );
};
