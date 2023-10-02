"use client"

import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from '@/components/ui/dialog'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'

const InitialModal = () => {

  const formSchema = z.object({
    name: z.string().min(1, {
      message: 'Server name is required'
    }),
    imageUrl: z.string().min(1, {
      message: 'Server image is Required'
    })
  })

  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    }
  })

  type formType = z.infer<typeof formSchema>;

  const {isSubmitting: isLoading} = form.formState

  const onSubmit: SubmitHandler<formType> = async (values) => {
    console.log(values)
  }


  return (
    <Dialog open>

      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>
            Customize your server
          </DialogTitle>

          <DialogDescription className='text-center text-zinc'>
            Give your server a personality with a name and image an image. You can always change it later. 
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>


              <div className='space-y-8 px-6'>
                <div className='flex items-center justify-center text-center'>
                  TODO: Image upload
                </div>

                <FormField 
                  control={form.control}
                  name="name"
                  render={({field}) => (
                    <FormItem>

                      <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                        Server name
                      </FormLabel>

                      <FormControl>
                        <Input  
                          disabled={isLoading}
                          className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 '
                          placeholder='Enter server name'
                          {...field}
                        />
                      </FormControl>

                    </FormItem>
                  )}
                />
              </div>

            </form>
        </Form>
      </DialogContent>
      
    </Dialog>
  )
}

export default InitialModal