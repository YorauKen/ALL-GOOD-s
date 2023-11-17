"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Trash } from "lucide-react";
import { zodResolver } from '@hookform/resolvers/zod';

import {  Color } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert-modal';
import Loading from '@/components/ui/loading';



const formSchema = z.object({
  name:z.string().min(1),
  value:z.string().min(4).regex(/^#/,{
    message:"String must be a valid hexcode",
  }),
});

type ColorFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData:Color | null,
}


const ColorForm:React.FC<ColorFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const title = initialData ? "Edit color" : "Create color"; 
  const description = initialData ? "Edit a color" : "Add a  color"; 
  const toastMessage = initialData ? "Color updated" : "Color created";
  const action = initialData ? "Save Changes" : "Create"; 

  const form = useForm<ColorFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData || {
      name:"",
      value:""
    }
  });

  const [open,setOpen] = useState(false);
  const [loading,setLoading] = useState(false);


  const onSubmit = async(data:ColorFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong please try again");
    } finally {
      setLoading(false);
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast.success("Size deleted.");
    } catch (error) {
      toast.error("Make Sure you remove all products using this size");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }



  return (
    <>
      <AlertModal 
        isOpen={open}
        onClose={()=>setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {initialData && (
          <Button
          disabled={loading}
          variant='destructive'
          size='icon'
          onClick={()=>setOpen(true)}
          >
          <Trash className="h-4 w-4"/>
        </Button>
        )}
        
          
      </div>

      <Separator/>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
            <div className='grid grid-cols-3 gap-8 '>
                <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input disabled={loading} {...field} placeholder='Color'/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}  
            /> 
                <FormField
                control={form.control}
                name="value"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <div className='flex items-center gap-4'>
                        <Input disabled={loading} {...field} placeholder='Color value'/>
                        <div 
                        className='border p-4 rounded-full'
                        style={{background:field.value}}
                        />
                      </div>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}  
            /> 
            </div>
            <Button disabled={loading} className='ml-auto' type='submit'>{action}</Button>
        </form>
      </Form>
      {loading && <Loading/>}
    </>
  )
}

export default ColorForm;