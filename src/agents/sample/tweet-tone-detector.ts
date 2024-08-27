import Agent from "src/lib/agent";

const PROMPT_TWEET_TONE_DETECTOR = `Your task is to analyze the provided tweet and identify the primary tone and sentiment expressed by the author. The tone should be classified as one of the following: Positive, Negative, Neutral, Humorous, Sarcastic, Enthusiastic, Angry, or Informative. The sentiment should be classified as Positive, Negative, or Neutral. Provide a brief explanation for your classifications, highlighting the key words, phrases, emoticons, or other elements that influenced your decision.`;

// @NOTE with credit to https://docs.anthropic.com/en/prompt-library/tweet-tone-detector
const TweetToneDetector = () =>
  Agent.create({
    name: "Tweet Tone Detector",
    prompt: PROMPT_TWEET_TONE_DETECTOR,
  });

export default TweetToneDetector;
