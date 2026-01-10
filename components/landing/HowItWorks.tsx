'use client';

import { UserPlus, CalendarCheck, Gift } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Profile',
    description: 'Set up your profile with your gifting preferences and default budget ranges.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '02',
    icon: CalendarCheck,
    title: 'Add Events & Contacts',
    description: 'Import or manually add contacts and their important dates like birthdays and anniversaries.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: '03',
    icon: Gift,
    title: 'Plan & Track Gifts',
    description: 'Create gift plans, get personalized suggestions, and track your gift-giving history.',
    color: 'from-pink-500 to-rose-500',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            How It{' '}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in minutes. No complexity, just smart gift planning.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-24 left-full w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-0 transform translate-x-1/2" />
                )}
                <Card className="relative z-10 text-center hover:shadow-xl transition-all hover:-translate-y-2">
                  <CardHeader>
                    <div className="mb-4 mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-md`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="mb-2 text-5xl font-bold text-slate-200">{step.number}</div>
                    <CardTitle className="text-2xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
