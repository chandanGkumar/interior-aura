'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PROJECT_TYPES = [
  'Full home interior',
  'Modular kitchen',
  'Bedroom / wardrobe',
  'Elevation / facade',
  'Vastu consultation',
  'Commercial space',
  'Other',
];

export function FormDialog({ open, onOpenChange }: FormDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function reset() {
    setName(''); setEmail(''); setProjectType(PROJECT_TYPES[0]);
    setBudget(''); setMessage('');
    setError(null); setDone(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) return setError('Please tell us your name.');
    if (!email.trim()) return setError('Email is required so we can reply.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Please provide a valid email address.');
    if (!message.trim()) return setError('Please describe your project or requirement.');

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, projectType, budget, message }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your message.');
      }
      setDone(true);
      toast.success('Enquiry sent', {
        description: 'The studio will be in touch within 1–2 working days.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose(open: boolean) {
    onOpenChange(open);
    if (!open) {
      // small delay so the close animation plays before reset
      setTimeout(reset, 250);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="overflow-hidden border-border/60 bg-background p-0 sm:max-w-lg">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-50 blur-3xl"
            style={{ background: 'radial-gradient(closest-side, var(--primary), transparent)' }}
          />
          <DialogHeader className="relative space-y-2 px-6 pt-7">
            <DialogTitle className="font-display text-3xl uppercase leading-none tracking-tight">
              Start a <span className="text-primary">project</span>
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Tell us about your space — we reply within 1–2 working days
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-6 py-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0.6, rotate: -8 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground"
                >
                  <CheckCircle2 className="h-7 w-7" />
                </motion.div>
                <h3 className="mt-5 font-display text-2xl uppercase leading-none">
                  Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
                </h3>
                <p className="mx-auto mt-3 max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                  Your enquiry is on its way to <span className="text-foreground">soumaysinghal11@gmail.com</span>.
                  The studio will reach out to you shortly at the email you provided.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    type="button"
                    onClick={() => handleClose(false)}
                    className="bg-foreground text-background hover:bg-foreground/90"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4 px-6 pt-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Full name
                    </Label>
                    <Input
                      id="form-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Soumay Singhal"
                      autoComplete="name"
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-email" className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Email address
                    </Label>
                    <Input
                      id="form-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      autoComplete="email"
                      className="bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-type" className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Project type
                    </Label>
                    <select
                      id="form-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-budget" className="font-mono text-[10px] uppercase tracking-[0.18em]">
                      Budget
                    </Label>
                    <Input
                      id="form-budget"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. ₹50 K – ₹10 L"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="form-message" className="font-mono text-[10px] uppercase tracking-[0.18em]">
                    Your requirement / message
                  </Label>
                  <Textarea
                    id="form-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the space, location, timeline, must-haves…"
                    rows={5}
                    className="bg-background resize-none"
                    required
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}

                <DialogFooter className="gap-3 pt-1">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="group w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending to studio…
                      </>
                    ) : (
                      <>
                        <Mail className="mr-1.5 h-4 w-4" />
                        Send enquiry
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </DialogFooter>

                <p className="pb-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Delivered to <span className="text-primary">soumaysinghal11@gmail.com</span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
