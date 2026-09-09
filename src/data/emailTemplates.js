// 15 "Write an Email" tasks — mixed formal and informal, in the official TOEFL format.
// keywords: used only by the offline fallback grader to check bullet-point coverage.
export const EMAIL_TEMPLATES = [
  {
    id: 'em01',
    kind: 'formal',
    title: 'Holiday party venue',
    scenario:
      'You are organizing a holiday party for your student club. You need to find a venue that can host the event and provide the necessary facilities. You want to contact a local community center to ask about their availability, pricing, and what facilities they offer.',
    recipient: 'Mr. Khan',
    role: 'the community center manager',
    subject: 'Inquiry about hosting an event',
    bullets: [
      'Explain the purpose of the event and the expected number of attendees.',
      'Ask about the available dates and costs for hosting the event.',
      "Describe the facilities you'll need for the event and ask if the center can accommodate your requests.",
    ],
    keywords: [
      ['party', 'event', 'club', 'celebration', 'attend', 'people', 'guests', 'members', 'students'],
      ['date', 'dates', 'cost', 'price', 'fee', 'available', 'availability', 'december', 'charge', 'rent'],
      ['facilit', 'room', 'hall', 'sound', 'kitchen', 'chairs', 'tables', 'equipment', 'projector', 'space', 'need'],
    ],
  },
  {
    id: 'em02',
    kind: 'formal',
    title: 'Assignment extension',
    scenario:
      'You are taking a history course this semester. You became ill last week and could not work on your final research paper, which is due in two days. You want to ask your professor for more time to finish it.',
    recipient: 'Professor Miller',
    role: 'your professor',
    subject: 'Request for an extension on the research paper',
    bullets: [
      'Explain why you were unable to work on the paper and mention how much of it you have completed.',
      'Request a specific new deadline that would allow you to finish the paper properly.',
      'Ask whether the extension would affect your grade and offer to provide any documents the professor needs.',
    ],
    keywords: [
      ['ill', 'sick', 'flu', 'fever', 'doctor', 'health', 'unable', 'completed', 'finished', 'half', 'draft'],
      ['deadline', 'extension', 'extra', 'days', 'week', 'submit', 'friday', 'monday', 'until'],
      ['grade', 'penalty', 'affect', 'points', 'note', 'certificate', 'document', 'proof', 'provide'],
    ],
  },
  {
    id: 'em03',
    kind: 'formal',
    title: 'Lost library book',
    scenario:
      'You borrowed a book from your university library, but you accidentally left it on a bus and could not get it back. The book is due next week. You need to inform the library about the situation.',
    recipient: 'Ms. Alvarez',
    role: 'the head librarian',
    subject: 'Lost library book',
    bullets: [
      'Explain which book you borrowed and how you lost it.',
      'Ask what the procedure is for lost books and how much you would need to pay.',
      'Ask whether you can replace the book yourself instead of paying the fine.',
    ],
    keywords: [
      ['book', 'borrowed', 'bus', 'lost', 'left', 'title', 'copy'],
      ['procedure', 'process', 'pay', 'fine', 'fee', 'cost', 'charge', 'how much'],
      ['replace', 'replacement', 'buy', 'purchase', 'new copy', 'instead', 'bookstore'],
    ],
  },
  {
    id: 'em04',
    kind: 'formal',
    title: 'Apartment heating repair',
    scenario:
      'You rent an apartment, and the heating system stopped working two days ago. The weather is getting colder, and you need the problem fixed quickly. You want to contact your landlord about the repair.',
    recipient: 'Mr. Romano',
    role: 'your landlord',
    subject: 'Heating problem in my apartment',
    bullets: [
      'Describe the problem with the heating system and when it started.',
      'Ask when a repair person could come and mention the times you are at home.',
      'Ask what you should do to stay warm until the heating is repaired.',
    ],
    keywords: [
      ['heat', 'heating', 'radiator', 'broken', 'stopped', 'cold', 'two days', 'working'],
      ['repair', 'fix', 'technician', 'come', 'visit', 'schedule', 'available', 'home', 'evening', 'morning'],
      ['until', 'meanwhile', 'temporary', 'heater', 'warm', 'suggest', 'solution', 'do'],
    ],
  },
  {
    id: 'em05',
    kind: 'formal',
    title: 'Rescheduling a job interview',
    scenario:
      'You applied for a part-time job at a marketing company, and they invited you to an interview next Tuesday morning. Unfortunately, you have an important exam at the same time. You need to ask for a different interview time.',
    recipient: 'Ms. Chen',
    role: 'the hiring manager',
    subject: 'Request to reschedule my interview',
    bullets: [
      'Thank the manager for the interview invitation and explain why you cannot attend at the scheduled time.',
      'Suggest two or three alternative days or times when you are available.',
      'Ask whether the interview will be in person or online and if you should prepare anything.',
    ],
    keywords: [
      ['thank', 'grateful', 'appreciate', 'exam', 'test', 'conflict', 'cannot', 'unable', 'tuesday'],
      ['alternative', 'instead', 'wednesday', 'thursday', 'friday', 'afternoon', 'available', 'suggest', 'reschedule'],
      ['in person', 'online', 'video', 'zoom', 'prepare', 'bring', 'documents', 'portfolio', 'format'],
    ],
  },
  {
    id: 'em06',
    kind: 'formal',
    title: 'Pausing a gym membership',
    scenario:
      'You have a yearly membership at a local fitness center. You will spend the next three months in another city for an internship, so you cannot use the gym during that time. You want to ask about pausing your membership.',
    recipient: 'Mr. Osei',
    role: 'the fitness center manager',
    subject: 'Request to pause my membership',
    bullets: [
      'Explain why you will be away and for how long.',
      'Ask whether it is possible to pause or freeze your membership during this period.',
      'Ask if there is any fee for pausing and what you need to do to arrange it.',
    ],
    keywords: [
      ['internship', 'city', 'away', 'three months', 'travel', 'moving', 'work'],
      ['pause', 'freeze', 'suspend', 'hold', 'membership', 'possible', 'period'],
      ['fee', 'charge', 'cost', 'free', 'form', 'arrange', 'process', 'need to do'],
    ],
  },
  {
    id: 'em07',
    kind: 'formal',
    title: 'Course registration problem',
    scenario:
      'You tried to register online for a psychology course that you need for your degree, but the system showed an error and did not let you enroll. The registration deadline is this Friday. You want to contact the registration office.',
    recipient: 'Ms. Park',
    role: 'the registration office manager',
    subject: 'Problem registering for a course',
    bullets: [
      'Explain which course you tried to register for and what error you experienced.',
      'Explain why the course is important for you and mention the registration deadline.',
      'Ask how the problem can be solved and whether a place in the course can be reserved for you.',
    ],
    keywords: [
      ['psychology', 'course', 'register', 'enroll', 'error', 'system', 'website', 'online', 'message'],
      ['degree', 'required', 'graduate', 'graduation', 'deadline', 'friday', 'important', 'need'],
      ['solve', 'fix', 'resolve', 'reserve', 'place', 'seat', 'spot', 'manually', 'help'],
    ],
  },
  {
    id: 'em08',
    kind: 'formal',
    title: 'Changing a hotel booking',
    scenario:
      'You booked a hotel room for a conference trip next month. Your plans have changed, and you now need to arrive two days earlier and stay in a larger room. You want to contact the hotel to change the reservation.',
    recipient: 'Mr. Dubois',
    role: 'the hotel reservations manager',
    subject: 'Change to my reservation',
    bullets: [
      'Give your booking information and explain what changes you need to make.',
      'Ask whether the new dates and a larger room are available.',
      'Ask about the price difference and whether there is a fee for changing the booking.',
    ],
    keywords: [
      ['booking', 'reservation', 'number', 'change', 'earlier', 'arrive', 'nights', 'dates', 'larger', 'double'],
      ['available', 'availability', 'free', 'room', 'confirm', 'possible'],
      ['price', 'difference', 'cost', 'fee', 'charge', 'extra', 'pay', 'policy'],
    ],
  },
  {
    id: 'em09',
    kind: 'formal',
    title: 'Joining a volunteer program',
    scenario:
      'Your city runs a weekend volunteer program that helps elderly people with shopping and technology. You saw an announcement that new volunteers are welcome, and you would like to join. You need to contact the program coordinator.',
    recipient: 'Ms. Ibrahim',
    role: 'the volunteer program coordinator',
    subject: 'Application to join the volunteer program',
    bullets: [
      'Introduce yourself and explain why you want to join the program.',
      'Describe any relevant experience or skills you have and mention when you are available.',
      'Ask whether training is provided and how you can officially sign up.',
    ],
    keywords: [
      ['student', 'name', 'join', 'volunteer', 'help', 'elderly', 'community', 'interested', 'because'],
      ['experience', 'skills', 'grandparents', 'computer', 'technology', 'weekends', 'saturday', 'sunday', 'available'],
      ['training', 'sign up', 'register', 'apply', 'application', 'form', 'start', 'provided'],
    ],
  },
  {
    id: 'em10',
    kind: 'informal',
    title: 'Missed class notes',
    scenario:
      'You missed two days of your biology class because you had a bad cold. Your classmate Daniel always takes good notes and attends every lecture. You want to ask him for help catching up.',
    recipient: 'Daniel',
    role: 'your classmate',
    subject: 'Can you help me catch up?',
    bullets: [
      'Explain why you missed the classes.',
      'Ask him to share his notes and tell you about any homework that was assigned.',
      'Offer to do something for him in return, such as helping him study or buying him a coffee.',
    ],
    keywords: [
      ['cold', 'sick', 'ill', 'missed', 'flu', 'two days', 'fever', "couldn't", 'absent'],
      ['notes', 'share', 'send', 'photo', 'copy', 'homework', 'assignment', 'due', 'missed anything'],
      ['return', 'coffee', 'lunch', 'help you', 'favor', 'owe', 'study together', 'thanks'],
    ],
  },
  {
    id: 'em11',
    kind: 'informal',
    title: 'A friend visiting your city',
    scenario:
      'Your good friend Maria is planning to visit your city for the first time next month. She asked you what she should see and do. You want to reply with suggestions and find out more about her trip.',
    recipient: 'Maria',
    role: 'your friend',
    subject: 'Your trip next month!',
    bullets: [
      'Say how happy you are about her visit.',
      'Suggest two or three places or activities you could do together and explain why she would enjoy them.',
      'Ask how long she will stay and what kind of activities she prefers.',
    ],
    keywords: [
      ['excited', 'happy', 'glad', "can't wait", 'great news', 'awesome', 'visit'],
      ['museum', 'park', 'restaurant', 'market', 'beach', 'old town', 'food', 'show', 'suggest', 'we could', 'take you'],
      ['how long', 'stay', 'days', 'prefer', 'like', 'outdoor', 'plans', 'when', 'arrive'],
    ],
  },
  {
    id: 'em12',
    kind: 'informal',
    title: 'Planning a surprise party',
    scenario:
      "Your roommate's birthday is in two weeks, and you want to organize a small surprise party for her. Your friend Sam knows her well and is good at organizing events. You want to ask Sam to help you plan it.",
    recipient: 'Sam',
    role: 'your friend',
    subject: 'Surprise party — I need your help!',
    bullets: [
      'Tell Sam about your party idea and why you want his help.',
      'Suggest how you could divide the tasks, such as food, decorations, and inviting people.',
      'Ask him which date works better for him and who else you should invite.',
    ],
    keywords: [
      ['surprise', 'party', 'birthday', 'roommate', 'idea', 'organize', 'plan', 'help'],
      ['food', 'cake', 'decoration', 'snacks', 'music', 'invite', 'tasks', 'i can', 'you could', 'handle'],
      ['date', 'saturday', 'friday', 'works', 'who else', 'guest', 'invite', 'people', 'friends'],
    ],
  },
  {
    id: 'em13',
    kind: 'informal',
    title: 'Starting a study group',
    scenario:
      'Your final exams start in three weeks, and you think studying with others would help you prepare better. Your classmate Priya mentioned she also wants to study with someone. You want to suggest forming a study group.',
    recipient: 'Priya',
    role: 'your classmate',
    subject: 'Study group for finals?',
    bullets: [
      'Suggest creating a study group and explain why you think it would help.',
      'Propose a time and place where the group could meet.',
      'Ask her which topics she finds most difficult and if she knows others who want to join.',
    ],
    keywords: [
      ['study group', 'together', 'prepare', 'finals', 'exam', 'help', 'idea', 'motivat'],
      ['library', 'cafe', 'campus', 'meet', 'tuesday', 'weekend', 'evening', 'time', 'place', 'room'],
      ['topics', 'difficult', 'hard', 'chapters', 'struggle', 'others', 'join', 'anyone else', 'know'],
    ],
  },
  {
    id: 'em14',
    kind: 'informal',
    title: 'Pet care while traveling',
    scenario:
      'You are going away for five days to attend your cousin’s wedding in another city. You have a cat, and you cannot take her with you. Your neighbor Jordan likes animals, and you want to ask him to take care of your cat.',
    recipient: 'Jordan',
    role: 'your neighbor',
    subject: 'A small favor while I’m away',
    bullets: [
      'Explain where you are going and for how long.',
      'Ask him to feed your cat and briefly explain what he would need to do.',
      'Offer to do something in return and tell him how he can get your apartment key.',
    ],
    keywords: [
      ['wedding', 'cousin', 'five days', 'away', 'trip', 'travel', 'city', 'leaving'],
      ['cat', 'feed', 'food', 'water', 'twice', 'litter', 'check', 'play', 'morning', 'evening'],
      ['return', 'favor', 'plants', 'help you', 'key', 'leave', 'mailbox', 'give you', 'owe'],
    ],
  },
  {
    id: 'em15',
    kind: 'informal',
    title: 'Borrowing a camera',
    scenario:
      'You are going on a hiking trip to the mountains next weekend and want to take good photos. Your friend Alex has a professional camera. You want to ask if you can borrow it for the trip.',
    recipient: 'Alex',
    role: 'your friend',
    subject: 'Could I borrow your camera?',
    bullets: [
      'Tell Alex about your trip and why you want to borrow the camera.',
      'Promise to take good care of it and say when you would return it.',
      'Ask him to show you how to use it and whether you should get any extra equipment, such as a memory card.',
    ],
    keywords: [
      ['hiking', 'trip', 'mountains', 'weekend', 'photos', 'pictures', 'borrow', 'camera', 'landscape'],
      ['care', 'careful', 'promise', 'return', 'monday', 'sunday', 'bring it back', 'safe', 'case'],
      ['show me', 'teach', 'how to use', 'settings', 'memory card', 'battery', 'lens', 'extra', 'equipment'],
    ],
  },
]

export function emailTaskIntro(t) {
  return `Write an email to ${t.role}, ${t.recipient}. In your email, do the following:`
}
