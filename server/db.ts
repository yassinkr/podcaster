"use server";
import './envConfig';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from 'drizzle-orm'
import * as schema from './schema';
import { eq } from "drizzle-orm";
import { sql as pg } from '@vercel/postgres';
import { Podcast as Newpodcast} from '@/types';
import { User as NewUser } from '@/types';
export const db =  drizzle(pg, { schema });
 

export async function getUsers() {
  return await db.query.Users.findMany();
};

export async function getUserById (id?: number)  {
  if(!id) throw new Error('id is required');
  return await db.select().from(schema.Users).where(eq(schema.Users.id, id)).execute();
}
export async function getUserByClerkId  (clerkId?: string ) {
  if(!clerkId) throw new Error('clerkId is required');
  return await db.select().from(schema.Users).where(eq(schema.Users.clerkId, clerkId)).execute();
}

export async function insertUser  (user?: NewUser)  {
  if(!user) throw new Error('user is required');
  return await db.insert(schema.Users).values(user);
}
export async function UpdateUser  ( user?: NewUser)  {
  if(!user) throw new Error('user is required');
  return await db.update(schema.Users).set(user).where(eq(schema.Users.clerkId, user.clerkId));
}

export async function deleteUser (clerkId?: string)  {
  if(!clerkId) throw new Error('clerkId is required');
  return await db.delete(schema.Users).where(eq(schema.Users.clerkId, clerkId));
}
export async function getTopUserByPodcastCount() {
  return await db.select({
    userId: schema.podcast.userId,
    count: sql<number>`count(${schema.podcast.userId})`.mapWith(Number)
  }).from(schema.podcast).groupBy(sql`${schema.podcast.userId}`).orderBy(sql`COUNT(*)`, sql`DESC`).limit(1).execute();
  }

  export async function getPodcastByURL  (url: string ) {
    if(!url) throw new Error("no url");
    return await db.query.podcast.findFirst({where:(eq(schema.podcast.audioURL,url))})
    }

export async function getPodcasts() {
  return await db.query.podcast.findMany();
}
export async function insertPodcast  (podcast: Newpodcast)  {
  if(!podcast) throw new Error('podcast is required');
  const newPodcast = await db.insert(schema.podcast).values(podcast);
 
  
  return newPodcast;
}

export async function UpdatePodcast (podcast:Newpodcast){
  return await db.update(schema.podcast).set(podcast).where(eq(schema.podcast.audioURL, podcast.audioURL));
}
 
export async function getPodcastByUserId (userId: string)  {
  if(!userId) throw new Error('author is required');
  return  await db.select().from(schema.podcast).where(eq(schema.podcast.userId, userId)).execute();
}
export async function getPodcastByTitle (title?: string)  {
  if(!title) throw new Error('title is required');
  return  await db.select().from(schema.podcast).where(eq(schema.podcast.title, title)).execute();
}
export async function getPodcastByDescription (description?: string)  {
  if(!description) throw new Error('description is required');
  return  await db.select().from(schema.podcast).where(eq(schema.podcast.description, description)).execute();
}


export async function getPodcastMaxViews() {
  return  await db.select().from(schema.podcast).orderBy(schema.podcast.views, sql`DESC`).limit(1).execute();
}

