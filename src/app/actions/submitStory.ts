'use server';

import { adminDb } from "@/lib/firebase-admin";
import { StorySubmissionPhase, StoryType } from "@/lib/models/storySubmission";

export async function submitStory(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string | null;
    const storyType = formData.get('storyType') as StoryType;
    const theme = formData.get('theme') as string;
    const mainStory = formData.get('mainStory') as string;
    const theStruggle = formData.get('theStruggle') as string | null;
    const theTurningPoint = formData.get('theTurningPoint') as string | null;
    const theLesson = formData.get('theLesson') as string | null;
    const keywords = formData.get('keywords') as string | null;
    const isAnonymous = formData.get('isAnonymous') === 'true';
    const preferredName = formData.get('preferredName') as string | null;

    if (!name || !email || !storyType || !theme || !mainStory) {
      return { success: false, error: 'Missing required fields.' };
    }

    const submissionData = {
      createdAt: new Date(),
      phase: StorySubmissionPhase.SUBMITTED,
      name,
      email,
      phoneNumber: phoneNumber || null,
      storyType,
      theme,
      mainStory,
      theStruggle: theStruggle || null,
      theTurningPoint: theTurningPoint || null,
      theLesson: theLesson || null,
      keywords: keywords || null,
      isAnonymous,
      preferredName: preferredName || null,
    };

    // Store in the new story_submissions collection
    await adminDb.collection("story_submissions").add(submissionData);

    return { success: true };
  } catch (error) {
    console.error("Error submitting story:", error);
    return { success: false, error: 'Failed to submit story. Please try again.' };
  }
}
