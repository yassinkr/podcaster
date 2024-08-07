"use client";
import React, { useRef, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import Image from 'next/image';
import { Podcast } from '@/types';
import { useRouter } from 'next/navigation';
const AudioPlayer = ({ audioUrl ,userPodcast }: { audioUrl: string ,userPodcast:Podcast []}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
 const router = useRouter();
 const handleNextPrev = (direction: string) => {
    const currentIndex = userPodcast.findIndex((podcast) => podcast.audioURL === audioUrl);
    if (direction === 'next') {
      const nextIndex = (currentIndex + 1) % userPodcast.length;
      router.push(`/podcast/${userPodcast[nextIndex].id}`);
    } else if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + userPodcast.length) % userPodcast.length;
      router.push(`/podcast/${userPodcast[prevIndex].id}`);
    }
 }
  // Play or pause the audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Set duration once metadata is loaded
  useEffect(() => {
    if (audioRef.current) {
      const setAudioData = () => {
        setDuration(audioRef.current!.duration);
      };
      audioRef.current.addEventListener('loadedmetadata', setAudioData);

      return () => {
        audioRef.current?.removeEventListener('loadedmetadata', setAudioData);
      };
    }
  }, []);

  // Update current time as audio plays
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  // Update the audio time when the range input is changed
  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Number(event.target.value);
      setCurrentTime(Number(event.target.value));
    }
  };
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };
  return (
    <div >
      <audio ref={audioRef} src={audioUrl} />
      <div className=" max-w-60">
      
      
        <div className='flex justify-between items-center text-white-1'>
            <h4>{formatTime(currentTime ? currentTime : 0)}</h4>
            <h4>{formatTime(audioRef.current ? audioRef.current.duration : 0)}</h4>
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className='w-full'
        />
        <div className='flex justify-around items-center w-full'>
        <Button className='bg-black-4' onClick={()=>handleNextPrev("prev")} variant="secondary">
          <Image
          src='/icons/reverse.svg'
          width={24}
          height={24}
          alt="controler"/>
        </Button>


        <Button className='bg-white-1' onClick={togglePlayPause} variant="secondary">
          <Image
          src={isPlaying ? '/icons/Pause.svg' : '/icons/Play.svg'}
          width={24}
          height={24}
          alt="controler"/>
        </Button>
        
        
        <Button className='bg-black-4' onClick={()=>handleNextPrev("next")} variant="secondary">
          <Image
          src='/icons/forward.svg'
          width={24}
          height={24}
          alt="controler"/>
        </Button>
        </div>
        </div>
      </div>
  );
};

export default AudioPlayer;
