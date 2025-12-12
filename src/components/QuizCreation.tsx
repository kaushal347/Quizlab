"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { quizCreationSchema } from '@/schemas/forms/quiz'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from './ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form'
import { Form } from "@/components/ui/form";
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { BookOpen, CopyCheck } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import LoadingQuestions from './LoadingQuestions'
import QuizBackground3DWrapper from './QuizBackground3DWrapper'; // Updated import

interface Props {
  topicParam: string
};

type Input = z.infer<typeof quizCreationSchema>

export const QuizCreation = ({ topicParam }: Props) => {
  const router = useRouter();

  React.useEffect(() => {
    router.prefetch("/play/mcq");
    router.prefetch("/play/open-ended");
  }, [router]);
  const [showLoader, setShowLoader] = React.useState(false);
  const [finished, setFinished] = React.useState(false);
  const { mutate: getQuestions, isPending } = useMutation({
    mutationFn: async ({ amount, topic, type }: Input) => {
      const response = await axios.post('/api/game', {
        amount,
        topic,
        type,
      });
      return response.data; // <— data returned properly
    },
  });

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      amount: 3,
      topic: topicParam,
      type: "open_ended",
    },
  });

  function onSubmit(input: Input) {
    setShowLoader(true)
    getQuestions(
      {
        amount: input.amount,
        topic: input.topic,
        type: input.type,
      },
      {
        onSuccess: (data) => {
          setFinished(true);
          if (form.getValues("type") == "open_ended") {
            router.push(`/play/open-ended/${data.gameId}`);
          } else {
            router.push(`/play/mcq/${data.gameId}`);
          }
        },
        onError: () => {
          setShowLoader(false)
        }
      }
    );
  }

  const type = form.watch("type");

  if (showLoader) {
    return <LoadingQuestions finished={finished} />;
  }
  return (
    <div className="relative w-full min-h-screen flex lg:grid lg:grid-cols-2 overflow-hidden">
      {/* LEFT SIDE: 3D Visualization */}
      <div className="relative hidden lg:block h-full w-full">
        <QuizBackground3DWrapper />
      </div>

      {/* RIGHT SIDE: Quiz Form */}
      <div className="relative w-full h-full flex items-center justify-center p-4 lg:p-8">
        {/* Mobile Background (Absolute) - Visible only on small screens if needed, or hide 3D on mobile */}
        <div className="absolute inset-0 z-0 lg:hidden">
          {/* Optional: simpler background or same 3D but faded */}
          <QuizBackground3DWrapper />
        </div>

        <Card className="bento-card border-none bg-black/40 backdrop-blur-xl shadow-2xl z-10 w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Quiz Creation
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure your next challenge.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* Topic */}
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Topic</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
                          placeholder="e.g. Molecular Biology"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Number of Questions</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500"
                          placeholder="Enter a number (1-10)"
                          type="number"
                          {...field}
                          onChange={(e) => {
                            form.setValue("amount", parseInt(e.target.value));
                          }}
                          min={1}
                          max={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Type Selection */}
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Button
                    type="button"
                    onClick={() => form.setValue("type", "mcq")}
                    className={`w-full py-6 text-lg transition-all border ${type === "mcq"
                      ? "bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    variant="ghost"
                  >
                    <CopyCheck className="w-5 h-5 mr-2" />
                    Multiple Choice
                  </Button>

                  <Button
                    type="button"
                    onClick={() => form.setValue("type", "open_ended")}
                    className={`w-full py-6 text-lg transition-all border ${type === "open_ended"
                      ? "bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                      }`}
                    variant="ghost"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Open Ended
                  </Button>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-6 text-lg shadow-lg"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
