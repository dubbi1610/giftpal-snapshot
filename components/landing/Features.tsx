'use client';

import { Calendar, Gift, Heart, Users, TrendingUp, Bell, Share2, BarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Calendar,
    title: 'Track Events',
    description: 'Never miss a birthday, anniversary, or special occasion. Set reminders and stay organized.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Gift,
    title: 'Plan Gifts',
    description: 'Create gift plans with budgets and ideas. Track purchases and gift-giving history.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Heart,
    title: 'Share Wishlists',
    description: 'Create and share wishlists with friends and family. Make gift-giving easier for everyone.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Users,
    title: 'Manage Contacts',
    description: 'Keep track of relationships, interests, and preferences for personalized gift suggestions.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Smart Suggestions',
    description: 'Get personalized gift ideas based on history, relationships, and interests.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart,
    title: 'Budget Tracking',
    description: 'Set budget ranges, track spending, and get budget guidance based on your gift history.',
    color: 'from-amber-500 to-orange-500',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 sm:text-5xl">
            Everything You Need to{' '}
            <span className="text-purple-600">
              Master Gift Giving
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Powerful features designed to make gift planning effortless and thoughtful.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="group hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:scale-105 bg-slate-50/50 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'both' }}
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 shadow-md group-hover:bg-purple-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    <Icon className="h-6 w-6 text-purple-600 group-hover:animate-wiggle" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
