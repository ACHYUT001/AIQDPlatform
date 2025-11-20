'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
    username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string().email("Invalid email address"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    linkedinUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
})

type BasicInfoFormProps = {
    defaultValues?: Partial<z.infer<typeof formSchema>>
    onSubmit: (data: z.infer<typeof formSchema>) => void
}

type FormSchemaType = z.infer<typeof formSchema>;

export function BasicInfoForm({ defaultValues, onSubmit }: BasicInfoFormProps) {
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues || {
            fullName: "",
            username: "",
            email: "",
            bio: "",
            website: "",
            linkedinUrl: "",
            githubUrl: "",
        },
    })

    const checkUsername = async (username: string) => {
        if (username.length < 3) return

        try {
            const response = await fetch(`/api/auth/check-username?username=${username}`)
            const data = await response.json()

            if (!data.available) {
                form.setError('username', {
                    type: 'manual',
                    message: 'Username is already taken'
                })
            } else {
                form.clearErrors('username')
            }
        } catch (error) {
            console.error('Error checking username:', error)
        }
    }

    return (
        <Card className="glass border-none text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe"
                                            {...field}
                                            className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all"
                                            onBlur={(e) => {
                                                field.onBlur()
                                                checkUsername(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="john@example.com" {...field} className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Bio</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Tell us about yourself..." {...field} className="bg-black/40 border-white/10 min-h-[100px] focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="website"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">Website / Portfolio (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com" {...field} className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="linkedinUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">LinkedIn URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://linkedin.com/in/yourprofile" {...field} className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="githubUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-muted-foreground">GitHub URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://github.com/yourusername" {...field} className="bg-black/40 border-white/10 focus:border-primary/50 focus:ring-primary/20 transition-all" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all">
                            Next Step
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
