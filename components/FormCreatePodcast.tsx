"use client";
import {  useCallback, useState, useTransition } from "react";
 
import { z } from "zod";
import { useForm,  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import  MyDropzone  from "./DropZone";
import { Podcast } from "@/types";
import { QueryResult } from "@vercel/postgres";
import { insertPodcast } from "@/server/db";
import { podcast } from "@/server/schema";
import { useFormState } from "react-dom";
import { title } from "process";

 

const formSchema = z.object({
    podcastTitle: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    Description: z.string().min(2, {
      message: "Description must be at least 2 characters.",
    }),
  });

  function LoadingSpinnerSvg() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white">
        <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25" />
        <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" className="spinner_ajPY" />
      </svg>
    );
  }

const initialState = {
  title: "",
  description: "",
  audioURL: "",
  imageURL: "",
  userId: "",
}
export  function FormCreatePodcast(
 { insertPodcast }: { insertPodcast: (podcast: Podcast) => Promise<Podcast> }
) {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [PodcastURL, setPodcastURL] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      Description: "",
    },
  });



  return (
    <section className="mt-10 flex flex-col">
      <h1 className='text-xl font-bold text-white-1'>Create Podcast</h1>
      <Form {...form}>
      <form action = {
        async ()=>{
        const {podcastTitle,Description}=form.getValues();
        const podcast:Podcast = {title:podcastTitle,
          description:Description,
          audioURL : PodcastURL, 
          imageURL: imageURL};
      
      const newpodcast= await insertPodcast(podcast);
       console.log(newpodcast);
      }}  className="space-y-8 mt-12 flex flex-col w-full">
      <div className="flex flex-col gap-[30px] bordr-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-base font-bold text-white-1">Podcast Title </FormLabel>
                  <FormControl>
                    <Input className="input-class focus-visible:ring-offset-orange-1" placeholder="القوة تتكلم" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Description"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-base font-bold text-white-1">Description </FormLabel>
                  <FormControl>
                    <Textarea className="input-class focus-visible:ring-offset-orange-1" placeholder="Write a short podcast description" {...field} />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col  ">
          <MyDropzone setPodcastURL={setPodcastURL} setImageURL={setImageURL}/>
    
            <div className="">
              <Button    className="text-base w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1">
                {isLoading ? (<><Loader size={20} className="animate-spin ml-2" /> Submitting </>) : ("Submit & Publish Podcast")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </section>
    
  );
}