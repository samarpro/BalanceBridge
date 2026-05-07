export type RsvpStatus = "going" | "not-going" | "undecided";

export interface CampusEvent {
    id: string;
    title: string;
    topic: string;
    typeLabel: string;
    goingCount: number;
    rsvp: RsvpStatus;
    when: string;
}

export const MOCK_EVENTS: CampusEvent[] = [
    {
        id: "1",
        title: "Quiet study pods — Library level 3",
        topic: "Exam season focus blocks",
        typeLabel: "Low-pressure social",
        goingCount: 14,
        rsvp: "undecided",
        when: "Thu · 5:00 pm",
    },
    {
        id: "2",
        title: "International student tea",
        topic: "Community & visas Q&A",
        typeLabel: "Facilitated meetup",
        goingCount: 32,
        rsvp: "going",
        when: "Sat · 11:00 am",
    },
    {
        id: "3",
        title: "Campus walk — 25 minutes",
        topic: "Movement between lectures",
        typeLabel: "Wellbeing",
        goingCount: 9,
        rsvp: "not-going",
        when: "Mon · 12:15 pm",
    },
];
