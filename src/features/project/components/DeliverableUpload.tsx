import React, { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { useUploadDeliverableFileMutation } from '../software/hooks';

interface FileUploadProps {
  projectId: string;
  deliverableId: string;
  onUploadSuccess: () => void;
}

export const DeliverableUpload: React.FC<FileUploadProps> = ({ projectId, deliverableId, onUploadSuccess }) => {
  const uploadMutation = useUploadDeliverableFileMutation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    uploadMutation.mutate({
      projectId,
      deliverableId,
      file: selectedFile
    }, {
      onSuccess: () => {
        alert(`${selectedFile.name} 업로드 완료!`);
        onUploadSuccess();
      },
      onError: (err) => {
        alert('업로드 중 오류가 발생했습니다.');
        console.error(err);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2 p-4 border-2 border-dashed rounded-lg text-center bg-zinc-50 border-zinc-200">
      <input 
        type="file" 
        id={`file-${deliverableId}`}
        className="hidden" 
        onChange={handleFileChange}
      />
      <label 
        htmlFor={`file-${deliverableId}`}
        className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors py-8 flex flex-col items-center"
      >
        <span className="text-sm font-medium">
          {selectedFile ? selectedFile.name : '파일을 선택하거나 드래그하세요'}
        </span>
        <span className="text-xs text-zinc-500 mt-1">
          (최대 50MB, PDF/ZIP 권장)
        </span>
      </label>
      
      <div className="flex justify-center gap-2 mt-2">
        <Button 
          size="sm" 
          disabled={!selectedFile || uploadMutation.isPending}
          onClick={handleUpload}
        >
          {uploadMutation.isPending ? '업로드 중...' : '업로드 시작'}
        </Button>
      </div>
    </div>
  );
};
