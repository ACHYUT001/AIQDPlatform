'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, FileText, X, Loader2 } from 'lucide-react'

type ResumeUploadProps = {
    onUpload: (file: File) => Promise<void>
    onSkip: () => void
    onBack: () => void
    isParsing: boolean
}

export function ResumeUpload({ onUpload, onSkip, onBack, isParsing }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    const handleUpload = async () => {
        if (file) {
            await onUpload(file)
        }
    }

    return (
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Upload Resume</CardTitle>
                <CardDescription className="text-gray-400">
                    Upload your resume to automatically fill your profile details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    className="border-2 border-dashed border-white/20 rounded-lg p-10 text-center hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />

                    {file ? (
                        <div className="flex flex-col items-center">
                            <FileText className="h-12 w-12 text-blue-400 mb-4" />
                            <p className="text-lg font-medium mb-2">{file.name}</p>
                            <p className="text-sm text-gray-400 mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                                <X className="h-4 w-4 mr-2" /> Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500">PDF only (Max 5MB)</p>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    <Button variant="outline" onClick={onBack} className="w-1/3" disabled={isParsing}>Back</Button>
                    <Button
                        onClick={handleUpload}
                        className="w-1/3 bg-blue-600 hover:bg-blue-700"
                        disabled={!file || isParsing}
                    >
                        {isParsing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Parsing...
                            </>
                        ) : (
                            "Upload & Parse"
                        )}
                    </Button>
                    <Button variant="ghost" onClick={onSkip} className="w-1/3" disabled={isParsing}>Skip</Button>
                </div>
            </CardContent>
        </Card>
    )
}
