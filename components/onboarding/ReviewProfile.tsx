'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'

type ReviewProfileProps = {
    data: any
    onSubmit: () => void
    onBack: () => void
    isSubmitting: boolean
}

export function ReviewProfile({ data, onSubmit, onBack, isSubmitting }: ReviewProfileProps) {
    return (
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Review Your Profile</CardTitle>
                <CardDescription className="text-gray-400">
                    Please review your details before submitting.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400 block">Full Name</span>
                            <span>{data.basicInfo?.fullName}</span>
                        </div>
                        <div>
                            <span className="text-gray-400 block">Email</span>
                            <span>{data.basicInfo?.email}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-gray-400 block">Bio</span>
                            <span>{data.basicInfo?.bio}</span>
                        </div>
                        {data.basicInfo?.website && (
                            <div className="col-span-2">
                                <span className="text-gray-400 block">Website</span>
                                <span>{data.basicInfo?.website}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills?.map((skill: any) => (
                            <Badge key={skill.name} variant="secondary">
                                {skill.name} ({skill.proficiency})
                            </Badge>
                        ))}
                        {(!data.skills || data.skills.length === 0) && (
                            <span className="text-gray-500 text-sm">No skills added.</span>
                        )}
                    </div>
                </div>

                {data.resumeData && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold border-b border-white/10 pb-2">Resume Data</h3>
                        <div className="bg-black/20 p-4 rounded-md text-sm text-gray-300 max-h-40 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans">
                                {JSON.stringify(data.resumeData, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                <div className="flex space-x-4 pt-4">
                    <Button variant="outline" onClick={onBack} className="w-1/2" disabled={isSubmitting}>Back</Button>
                    <Button
                        onClick={onSubmit}
                        className="w-1/2 bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Creating Profile..." : (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm & Create
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
