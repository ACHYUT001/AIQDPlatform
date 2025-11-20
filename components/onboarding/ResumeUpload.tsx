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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0]
            setFile(selectedFile)
            // Automatically upload and parse
            await onUpload(selectedFile)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0]
            setFile(droppedFile)
            // Automatically upload and parse
            await onUpload(droppedFile)
        }
    }

    const handleUpload = async () => {
        if (file) {
            await onUpload(file)
        }
    }

    return (
        <Card className="glass border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Upload Resume</CardTitle>
                <CardDescription className="text-muted-foreground text-center">
                    Upload your resume to automatically fill your profile details.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div
                    className="border-2 border-dashed border-white/10 rounded-xl p-10 text-center hover:bg-white/5 hover:border-primary/50 transition-all duration-300 cursor-pointer group"
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
                        <div className="flex flex-col items-center animate-fade-in-up">
                            <FileText className="h-16 w-16 text-primary mb-4 drop-shadow-[0_0_10px_rgba(0,255,163,0.5)]" />
                            <p className="text-lg font-medium mb-2 text-white">{file.name}</p>
                            <p className="text-sm text-muted-foreground mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="hover:text-destructive hover:bg-destructive/10">
                                <X className="h-4 w-4 mr-2" /> Remove
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                            <Upload className="h-16 w-16 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                            <p className="text-lg font-medium mb-2 text-white">Click to upload or drag and drop</p>
                            <p className="text-sm text-muted-foreground">PDF only (Max 5MB)</p>
                        </div>
                    )}
                </div>

                <div className="flex space-x-4">
                    <Button
                        onClick={handleUpload}
                        className="w-1/2 bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all"
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
                    <Button variant="ghost" onClick={onSkip} className="w-1/2 text-muted-foreground hover:text-white hover:bg-white/5" disabled={isParsing}>Skip</Button>
                </div>
            </CardContent>
        </Card>
    )
}
