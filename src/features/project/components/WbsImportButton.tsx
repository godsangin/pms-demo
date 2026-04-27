import { useState, useRef } from 'react'
import { Button } from '@/shared/ui/Button'
import { importWbsCsv } from '../api'

export function WbsImportButton({ 
  projectId, 
  onSuccess 
}: { 
  projectId: string; 
  onSuccess: () => void 
}) {
  const [isImporting, setIsImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const result = await importWbsCsv(projectId, file)
      alert(`성공적으로 ${result.updatedCount}개의 테스크가 업데이트되었습니다.`)
      onSuccess()
    } catch (err) {
      alert('WBS 업데이트 중 오류가 발생했습니다.')
      console.error(err)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".csv"
        onChange={handleFileChange}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={isImporting}
        onClick={() => fileInputRef.current?.click()}
      >
        {isImporting ? '업데이트 중...' : 'WBS 업데이트 (CSV)'}
      </Button>
    </>
  )
}
