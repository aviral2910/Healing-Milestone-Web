export enum StorySubmissionPhase {
  SUBMITTED = 'submitted',
  CONVERTED_TO_STORIES = 'convertedToStories',
  SEND_TO_VERIFICATION = 'sendToVerification',
  VERIFIED = 'verified'
}

export enum StoryType {
  STORY = 'story',
  FINDING = 'finding',
  AWARENESS = 'awareness'
}

export interface StorySubmission {
  // Metadata
  id?: string;
  createdAt: Date;
  phase: StorySubmissionPhase;

  // Contact Info
  name: string;
  email: string;
  phoneNumber?: string;
  
  // Story Details
  storyType: StoryType;
  theme: string;
  mainStory: string;
  theStruggle?: string;
  theTurningPoint?: string;
  theLesson?: string;
  keywords?: string;
  
  // Preferences
  isAnonymous: boolean;
  preferredName?: string;
}
