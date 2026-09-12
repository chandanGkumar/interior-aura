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
import { CONTACT_EMAIL, INSTAGRAM_URL } from '@/lib/contact';

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
  /** Honeypot. Hidden from people; bots fill it in and get discarded. */
  const [company, setCompany] = useState('');
  /** What the server actually did: 'smtp' = emailed, 'local-file' = not emailed. */
  const [channel, setChannel] = useState<string | null>(null);

  function reset() {
    setName(''); setEmail(''); setProjectType(PROJECT_TYPES[0]);
    setBudget(''); setMessage(''); setCompany('');
    setError(null); setDone(false); setChannel(null);
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
        body: JSON.stringify({ name, email, projectType, budget, message, company }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Could not send your message.');
      }
      setDone(true);
      setChannel(typeof data.channel === 'string' ? data.channel : null);
      // Only claim delivery when the server actually sent an email.
      if (data.channel === 'smtp') {
        toast.success('Enquiry sent', {
          description: 'The studio will be in touch within 1-2 working days.',
        });
      } else {
        toast.warning('Enquiry recorded', {
          description: 'Email delivery is not configured yet - please also reach us on Instagram.',
        });
      }
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
            <DialogTitle className="font-display text-4xl uppercase leading-none tracking-tight">
              Start a <span className="text-primary">project</span>
            </DialogTitle>
            <DialogDescription className="font-mono fs-meta uppercase tracking-[0.1em] text-muted-foreground">
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
                <h3 className="mt-5 font-display text-3xl uppercase leading-none">
                  Thank you{name ? `, ${name.split(' ')[0]}` : ''}.
                </h3>
                <p className="mx-auto mt-3 max-w-[40ch] fs-body leading-relaxed text-muted-foreground">
                  {channel === 'smtp' ? (
                    <>
                      Your enquiry is on its way to{' '}
                      <span className="text-foreground">{CONTACT_EMAIL}</span>. The studio will
                      reach out shortly at the email you provided.
                    </>
                  ) : (
                    <>
                      We have recorded your enquiry, but email delivery is not switched on yet, so
                      it has not reached the studio inbox. Please also message us on{' '}
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary underline underline-offset-2"
                      >
                        Instagram
                      </a>{' '}
                      so nothing is missed.
                    </>
                  )}
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
                {/* Honeypot. Hidden from people and from screen readers; bots
                    fill it and the server silently discards the submission.
                    Must not use display:none - some bots skip those. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden opacity-0"
                >
                  <label htmlFor="form-company">Company (leave this blank)</label>
                  <input
                    id="form-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="form-name" className="font-mono fs-meta uppercase tracking-[0.1em]">
                      Full name
                    </Label>
                    <Input
                      id="form-name"
                      maxLength={120}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Soumay Singhal"
                      autoComplete="name"
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-email" className="font-mono fs-meta uppercase tracking-[0.1em]">
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
                    <Label htmlFor="form-type" className="font-mono fs-meta uppercase tracking-[0.1em]">
                      Project type
                    </Label>
                    <select
                      id="form-type"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 fs-body text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="form-budget" className="font-mono fs-meta uppercase tracking-[0.1em]">
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
                  <Label htmlFor="form-message" className="font-mono fs-meta uppercase tracking-[0.1em]">
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
                    className="rounded-md bg-destructive/10 px-3 py-2 fs-body text-destructive"
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

                <p className="pb-6 text-center font-mono fs-meta uppercase tracking-[0.1em] text-muted-foreground">
                  Delivered to <span className="text-primary">{CONTACT_EMAIL}</span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
