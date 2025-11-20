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
        <Card className="glass border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Review Your Profile</CardTitle>
                <CardDescription className="text-muted-foreground text-center">
                    Please review your details before submitting.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-primary">Basic Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground block">Full Name</span>
                            <span>{data.basicInfo?.fullName}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground block">Email</span>
                            <span>{data.basicInfo?.email}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground block">Bio</span>
                            <span>{data.basicInfo?.bio}</span>
                        </div>
                        {data.basicInfo?.website && (
                            <div className="col-span-2">
                                <span className="text-muted-foreground block">Website</span>
                                <span className="text-blue-400 hover:underline cursor-pointer">{data.basicInfo?.website}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-2 text-primary">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills?.map((skill: any) => (
                            <Badge key={skill.name} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                                {skill.name} ({skill.proficiency})
                            </Badge>
                        ))}
                        {(!data.skills || data.skills.length === 0) && (
                            <span className="text-muted-foreground text-sm">No skills added.</span>
                        )}
                    </div>
                </div>

                <div className="flex space-x-4 pt-4">
                    <Button variant="outline" onClick={onBack} className="w-1/2 border-white/10 hover:bg-white/5 hover:text-white" disabled={isSubmitting}>Back</Button>
                    <Button
                        onClick={onSubmit}
                        className="w-1/2 bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all"
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
