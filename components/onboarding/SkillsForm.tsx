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
        <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex space-x-2">
                    <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g. Python, Translation)"
                        className="bg-black/20 border-white/10"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <select
                        value={proficiency}
                        onChange={(e) => setProficiency(e.target.value as any)}
                        className="bg-black/20 border-white/10 rounded-md px-3 text-sm"
                    >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="expert">Expert</option>
                    </select>
                    <Button onClick={addSkill} size="icon" variant="secondary">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border border-white/10 rounded-md bg-black/20">
                    {skills.length === 0 && (
                        <span className="text-gray-500 text-sm">No skills added yet.</span>
                    )}
                    {skills.map((skill) => (
                        <Badge key={skill.name} variant="secondary" className="px-3 py-1 flex items-center gap-2">
                            {skill.name} <span className="text-xs opacity-70">({skill.proficiency})</span>
                            <X
                                className="h-3 w-3 cursor-pointer hover:text-red-400"
                                onClick={() => removeSkill(skill.name)}
                            />
                        </Badge>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <Button variant="outline" onClick={onBack} className="w-1/2">Back</Button>
                    <Button onClick={() => onSubmit(skills)} className="w-1/2">Next Step</Button>
                </div>
            </CardContent>
        </Card>
    )
}
