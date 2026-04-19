import React, { useState } from 'react';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';

interface ProjectFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    techStack: '',
    architectureType: 'Microservices'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map((s: string) => s.trim()) : formData.techStack
    });
  };

  return (
    <Card className="p-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">{initialData ? '프로젝트 수정' : '신규 프로젝트 등록'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">프로젝트 명</label>
          <input 
            className="w-full p-2 border rounded-md dark:bg-slate-800"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">시작일</label>
            <input 
              type="date"
              className="w-full p-2 border rounded-md dark:bg-slate-800"
              value={formData.startDate}
              onChange={e => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">종료일</label>
            <input 
              type="date"
              className="w-full p-2 border rounded-md dark:bg-slate-800"
              value={formData.endDate}
              onChange={e => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">기술 스택 (쉼표로 구분)</label>
          <input 
            placeholder="React, NestJS, PostgreSQL"
            className="w-full p-2 border rounded-md dark:bg-slate-800"
            value={formData.techStack}
            onChange={e => setFormData({...formData, techStack: e.target.value})}
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>취소</Button>
          <Button type="submit" variant="primary">저장하기</Button>
        </div>
      </form>
    </Card>
  );
};
