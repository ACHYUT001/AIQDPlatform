'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Plus } from 'lucide-react'

type Skill = {
    name: string
    proficiency: 'beginner' | 'intermediate' | 'expert'
}

type SkillsFormProps = {
    defaultValues?: Skill[]
    onSubmit: (skills: Skill[]) => void
    onBack: () => void
}

export function SkillsForm({ defaultValues = [], onSubmit, onBack }: SkillsFormProps) {
    const [skills, setSkills] = useState<Skill[]>(defaultValues)
    const [newSkill, setNewSkill] = useState("")
    const [proficiency, setProficiency] = useState<'beginner' | 'intermediate' | 'expert'>('beginner')

    const addSkill = () => {
        if (newSkill.trim() && !skills.find(s => s.name.toLowerCase() === newSkill.toLowerCase())) {
            setSkills([...skills, { name: newSkill.trim(), proficiency }])
            setNewSkill("")
        }
    }

    const removeSkill = (name: string) => {
        setSkills(skills.filter(s => s.name !== name))
    }

    return (
        <Card className="glass border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex space-x-2">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g. Python, Translation)"
                        className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <select
                        value={proficiency}
                        onChange={(e) => setProficiency(e.target.value as any)}
                        className="bg-black/40 border-white/10 rounded-md px-3 text-sm focus:border-primary/50 focus:ring-primary/20 transition-all outline-none"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                    <Button onClick={addSkill} size="icon" className="bg-primary text-black hover:bg-primary/90">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border border-white/10 rounded-xl bg-black/20">
                    {skills.length === 0 && (
                        <span className="text-muted-foreground text-sm">No skills added yet.</span>
                    )}
                    {skills.map((skill) => (
                        <Badge key={skill.name} variant="secondary" className="px-3 py-1 flex items-center gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                            <>
                                {skill.name} <span className="text-xs opacity-70">({skill.proficiency})</span>
                                <X
                                    className="h-3 w-3 cursor-pointer hover:text-red-400"
                                    onClick={() => removeSkill(skill.name)}
                                />
                            </>
                        </Badge>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <Button variant="outline" onClick={onBack} className="w-1/2 border-white/10 hover:bg-white/5 hover:text-white">Back</Button>
                    <Button onClick={() => onSubmit(skills)} className="w-1/2 bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all">Next Step</Button>
                </div>
            </CardContent>
        </Card>
    )
}
