export interface ServiceItem {
  id: string;
  name: string;
  description: string;
}

export const serviceItems: ServiceItem[] = [
  {
    id: "photography",
    name: "Photography",
    description:
      "I like making things look good, but with purpose. From people and products to lifestyle and editorial, I use light, composition and a slightly obsessive eye for detail to create images that feel considered, memorable and anything but boring."
  },
  {
    id: "videography-reels",
    name: "Videography & Reels",
    description:
      "Whether it's a cinematic piece or a 30-second reel that needs to stop the scroll, I make video that moves. From the first idea to the final cut, colour grade and export, I can take it from \"we should make something\" to \"okay… that's actually sick.\""
  },
  {
    id: "brand-campaign-content",
    name: "Brand & Campaign Content",
    description:
      "Good brands deserve more than pretty pictures. I turn ideas, identities and campaigns into visuals that feel cohesive and actually say something to viewers, making them more memorable. Photography, video, creative direction: whatever the idea needs, I'm here to help you put the vision into reality."
  },
  {
    id: "automotive-shoots",
    name: "Automotive Shoots",
    description:
      "Cars have personalities. Some are elegant, some are aggressive, and some have absolutely no business being that loud. I use photography, cinematic video and creative composition to capture the details, attitude and character that make a car feel like more than just a car. I produce visuals that are far from the norm, incorporating different art styles to tell the brand's story rather than shoot another sales-facing ad, visuals that leave the viewer with an emotion."
  },
  {
    id: "event-coverage",
    name: "Event Coverage",
    description:
      "I'm there for the big moments, and usually the ones happening three seconds before them. From brand launches and corporate events to private functions and chaotic celebrations, I capture the atmosphere, energy and little details that make the day worth remembering."
  }
];
