export type RsvpStatus = "going" | "not-going" | "undecided";

export interface CampusEvent {
    id: string;
    title: string;
    topic: string;
    typeLabel: string;
    tags: string[];
    coverTone: "mint" | "violet" | "sunset";
    goingCount: number;
    rsvp: RsvpStatus;
    when: string;
}

export const MOCK_EVENTS: CampusEvent[] = [
    {
        id: "ev-01",
        title: "Sunrise run club — oval meetup",
        topic: "Easy pace, all fitness levels",
        typeLabel: "Movement",
        tags: ["Run", "Morning", "Outdoor"],
        coverTone: "sunset",
        goingCount: 28,
        rsvp: "going",
        when: "Mon · 6:45 am",
    },
    {
        id: "ev-02",
        title: "Free breakfast burritos — student union",
        topic: "First 80 students — bring your ID",
        typeLabel: "Campus perk",
        tags: ["Food", "Union", "Free"],
        coverTone: "mint",
        goingCount: 156,
        rsvp: "undecided",
        when: "Tue · 8:00 am",
    },
    {
        id: "ev-03",
        title: "Speed‑friending for new arrivals",
        topic: "Rotating 5‑minute chats + snacks",
        typeLabel: "Social",
        tags: ["Welcome", "Friends", "Tea"],
        coverTone: "violet",
        goingCount: 62,
        rsvp: "going",
        when: "Tue · 5:30 pm",
    },
    {
        id: "ev-04",
        title: "Tech careers panel — intern stories",
        topic: "Hear from grads who juggled shifts + study",
        typeLabel: "Careers",
        tags: ["Work", "Tech", "Panel"],
        coverTone: "violet",
        goingCount: 94,
        rsvp: "undecided",
        when: "Wed · 1:00 pm",
    },
    {
        id: "ev-05",
        title: "Outdoor study jam — acoustic playlist",
        topic: "BYO blanket + charger; free iced tea",
        typeLabel: "Study social",
        tags: ["Study", "Music", "Lawn"],
        coverTone: "mint",
        goingCount: 41,
        rsvp: "going",
        when: "Thu · 3:15 pm",
    },
    {
        id: "ev-06",
        title: "Late‑night pancake lab",
        topic: "Chem club demos + toppings bar",
        typeLabel: "STEM fun",
        tags: ["Science", "Night", "Food"],
        coverTone: "sunset",
        goingCount: 73,
        rsvp: "not-going",
        when: "Thu · 9:00 pm",
    },
    {
        id: "ev-07",
        title: "Volunteer tree planting — shuttle leaves quad",
        topic: "Gear + gloves provided; 3 hours outdoors",
        typeLabel: "Volunteering",
        tags: ["Green", "Shuttle", "Hands-on"],
        coverTone: "mint",
        goingCount: 36,
        rsvp: "undecided",
        when: "Sat · 8:30 am",
    },
    {
        id: "ev-08",
        title: "Lo‑fi beats study lock‑in (silent disco)",
        topic: "Two floors library — headphones at door",
        typeLabel: "Focus sprint",
        tags: ["Study", "Lo-fi", "Exams"],
        coverTone: "violet",
        goingCount: 112,
        rsvp: "going",
        when: "Sat · 6:00 pm",
    },
    {
        id: "ev-09",
        title: "Sunday farmers market stroll",
        topic: "Meet at east gate; optional brunch after",
        typeLabel: "Wellbeing",
        tags: ["Walk", "Market", "Sunday"],
        coverTone: "sunset",
        goingCount: 19,
        rsvp: "undecided",
        when: "Sun · 10:00 am",
    },
    {
        id: "ev-10",
        title: "Board games + bubble tea night",
        topic: "Bring a favourite small game if you like",
        typeLabel: "Social",
        tags: ["Games", "Bubble tea", "Chill"],
        coverTone: "violet",
        goingCount: 58,
        rsvp: "undecided",
        when: "Sun · 7:00 pm",
    },
];
