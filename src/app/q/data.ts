export type RoundColor = 'yellow' | 'green' | 'pink' | 'red';

export interface Riddle {
  step: number;
  riddleText: string;
  hint: string;
  secret: string;
}

export interface RoundData {
  color: RoundColor;
  title: string;
  riddles: Riddle[];
}

export const QUEST_DATA: Record<RoundColor, RoundData> = {
  yellow: {
    color: 'yellow',
    title: 'The Haldi Round',
    riddles: [
      { step: 1, riddleText: "I have a heavy pulse but no heart. I speak in beats instead of words. When I get loud, nobody stays in their seat.", hint: "The Speakers / DJ", secret: "ylw1" },
      { step: 2, riddleText: "I hold a treasure that isn't meant to be kept, but meant to be painted on a face. I am the very first step to a golden glow.", hint: "The Haldi Bowl", secret: "ylw2" },
      { step: 3, riddleText: "I blink only once, yet I steal a moment forever. I have a memory that never fades, but I need someone to carry me around.", hint: "The Photographer (or Camera)", secret: "ylw3" },
      { step: 4, riddleText: "People happily wait in line for me just to shed a tear of joy. I am small, round, fragile, and full of spice.", hint: "Pani Puri / Chaat Stall", secret: "ylw4" },
      { step: 5, riddleText: "I am filled to the brim but I never take a sip. I sweat on the outside only when I'm freezing on the inside.", hint: "The Ice Cooler / Drinks Station", secret: "ylw5" },
      { step: 6, riddleText: "I share her parents, but not her new last name. I might be smiling today, but I'll miss her just the same. Come ask me for the clue.", hint: "Aviral (The Brother)", secret: "ylw6" },
      { step: 7, riddleText: "I am the only acceptable reason to completely ruin your appetite. I wait patiently at the end of the line, bringing a sticky delight.", hint: "The Dessert Table", secret: "ylw7" },
      { step: 8, riddleText: "I stand proudly at the border of the celebration, greeting every single guest by name, yet I never speak a word.", hint: "The Welcome Sign / Floral Entrance", secret: "ylw8" }
    ]
  },
  green: {
    color: 'green',
    title: 'The Mehndi Round',
    riddles: [
      { step: 1, riddleText: "I cry green tears that eventually turn dark brown. Through tiny swirls, I leave my mark on the most beautiful bride in town.", hint: "The Mehndi Cones / The Artist", secret: "grn1" },
      { step: 2, riddleText: "I am as sour as a citrus, but sweetened with care. Dabb me on gently to make sure the dark color stays right there.", hint: "The Lemon & Sugar Mixture", secret: "grn2" },
      { step: 3, riddleText: "I am a fragile circle of glass, coming in every color of the rainbow. Slip me on, and I make music whenever your hands move.", hint: "The Bangle Stall / Box", secret: "grn3" },
      { step: 4, riddleText: "I am brewed hot and poured from up high. Without my sweet energy, the chatting aunties might just say goodbye.", hint: "The Chai / Tea Counter", secret: "grn4" },
      { step: 5, riddleText: "I have a hollow belly and two tight heads. Tap me with a spoon or your hands, and I'll keep the rhythm going until everyone goes to bed.", hint: "The Dholki / Hand Drum", secret: "grn5" },
      { step: 6, riddleText: "I didn't paint the intricate maze, but it is my hidden initial that everyone is trying to read.", hint: "The Groom", secret: "grn6" },
      { step: 7, riddleText: "I am bright orange and strung on a long thread. I drape from the ceiling and hang round your head.", hint: "Marigold (Genda Phool) Decorations", secret: "grn7" },
      { step: 8, riddleText: "I am a giant umbrella, but I have never blocked a drop of rain. I flash brightly instead, just to make sure the memories remain.", hint: "The Photographer's Lighting Umbrella", secret: "grn8" }
    ]
  },
  pink: {
    color: 'pink',
    title: 'The Sangeet Round',
    riddles: [
      { step: 1, riddleText: "I stand right behind the couple, covered in vibrant colors. I am here to make sure every single photo has a beautiful background.", hint: "The Floral Backdrop / Stage Wall", secret: "pnk1" },
      { step: 2, riddleText: "We shared secrets in the dark and stole clothes from the same closet.", hint: "The Bride's Sister", secret: "pnk2" },
      { step: 3, riddleText: "I am meant to block the rain or sun, but today I am just hanging upside down to make the venue look pretty.", hint: "Traditional Umbrella Decor", secret: "pnk3" },
      { step: 4, riddleText: "My family is growing by one today, as I welcome a beautiful new daughter with open arms.", hint: "The Groom's Mother", secret: "pnk4" },
      { step: 5, riddleText: "I am a metal tray that carries the sacred powder, a small lamp, and the golden blessings of the elders.", hint: "The Puja Thali / Sacred Plate", secret: "pnk5" },
      { step: 6, riddleText: "I know all his embarrassing stories from his youth, and I might just share them on the microphone later.", hint: "The Groom's Best Friend / Brother", secret: "pnk6" },
      { step: 7, riddleText: "I am the reason you are all gathered here today, and I am about to be covered in yellow paste!", hint: "The Bride Herself!", secret: "pnk7" },
      { step: 8, riddleText: "I held her first before anyone else could, and today my eyes are full of tears of joy.", hint: "The Bride's Mother", secret: "pnk8" }
    ]
  },
  red: {
    color: 'red',
    title: 'The Love Round',
    riddles: [
      { step: 1, riddleText: "I carried her on my shoulders when she was small, and today I stand the proudest of them all.", hint: "The Bride's Father", secret: "red1" },
      { step: 2, riddleText: "I raised the man who stole her heart. Come to me to do your part.", hint: "The Groom's Father", secret: "red2" },
      { step: 3, riddleText: "The photographer captures a single frozen second, but I capture the entire story in motion.", hint: "The Videographer", secret: "red3" },
      { step: 4, riddleText: "I am her mother's brother. It is my traditional duty to bring the sweet gifts and guide her steps today.", hint: "The Bride's Maternal Uncle (Mama)", secret: "red4" },
      { step: 5, riddleText: "I am the one holding her phone, fixing her hair, and making sure her makeup doesn't get ruined.", hint: "The Bride's Best Friend / Bridesmaid", secret: "red5" },
      { step: 6, riddleText: "I am meant to protect his feet, but soon I will become a valuable hostage waiting to be stolen by the sisters.", hint: "The Groom's Shoes", secret: "red6" },
      { step: 7, riddleText: "I have the most silver in my hair and the most wisdom in my smile. Come touch my feet to get your next clue.", hint: "The Grandparents (or Eldest Relative)", secret: "red7" },
      { step: 8, riddleText: "We are a matching pair of chairs, waiting empty for the two most important people to sit down.", hint: "The Couple's Seating (Main Thrones)", secret: "red8" }
    ]
  }
};
