// 15 "Write for an Academic Discussion" tasks in the official TOEFL format:
// a professor's question plus two student posts with different viewpoints.
export const DISCUSSION_TEMPLATES = [
  {
    id: 'ad01',
    title: 'Cultural diversity',
    subject: 'anthropology',
    professor: 'Dr. Gupta',
    question:
      "We're studying how communities benefit when people from different cultural backgrounds live and work together. Some researchers believe that cultural diversity helps communities by bringing new foods, languages, art forms, and business ideas that create economic opportunities and enrich daily life. Others believe that having shared cultural traditions and common languages makes it easier for people to communicate and cooperate effectively. Which factor do you think contributes more to building strong, successful communities?",
    students: [
      {
        name: 'Kelly',
        text: 'I believe cultural diversity helps build stronger communities by bringing valuable new resources and opportunities. When people from different backgrounds share their traditional foods, music, and art forms, they create vibrant festivals and businesses that attract visitors and generate income. Additionally, multilingual residents help local businesses expand internationally and serve diverse customer groups more effectively.',
      },
      {
        name: 'Andrew',
        text: "I think having shared cultural traditions and common languages makes communities more successful and cohesive. When residents speak the same language and celebrate similar holidays, they can communicate easily, organize community events more efficiently, and work together on local projects. Shared cultural practices help neighbors understand each other's expectations and build trust quickly.",
      },
    ],
  },
  {
    id: 'ad02',
    title: 'Remote work',
    subject: 'business management',
    professor: 'Dr. Chen',
    question:
      'More companies than ever now allow employees to work from home instead of coming to an office every day. Some people argue that remote work makes employees happier and more productive, while others believe that working together in a physical office leads to better teamwork and creativity. In your opinion, is remote work good or bad for companies and their employees?',
    students: [
      {
        name: 'Sofia',
        text: 'In my view, remote work benefits everyone. Employees save hours every week by not commuting, and they can use that time to rest or finish more tasks. My sister started working from home last year, and she says she concentrates much better without office noise. Companies also save money on office space and can hire talented people from anywhere in the world.',
      },
      {
        name: 'Marcus',
        text: 'I disagree with the idea that remote work is always better. When people never meet face to face, they miss the quick conversations that create new ideas and strong friendships. New employees especially struggle to learn the company culture through a screen. I believe teams that share a physical space solve problems faster and feel more connected to their work.',
      },
    ],
  },
  {
    id: 'ad03',
    title: 'Social media and young people',
    subject: 'sociology',
    professor: 'Dr. Rivera',
    question:
      'Social media platforms are now a central part of daily life for most young people. Some researchers argue that social media helps young people stay connected, learn new things, and express themselves creatively. Others believe it harms their concentration, self-esteem, and real-world relationships. Overall, do you think social media has a positive or negative effect on young people?',
    students: [
      {
        name: 'Emma',
        text: 'I believe social media is mostly positive for young people. It allows them to keep in touch with friends and family who live far away, and it exposes them to different cultures and ideas they would never encounter otherwise. Many students even use platforms like YouTube to learn languages, coding, and other valuable skills for free.',
      },
      {
        name: 'Liam',
        text: 'I would argue that the negative effects are stronger. Many young people spend hours scrolling instead of studying, exercising, or sleeping. They constantly compare themselves to unrealistic images, which damages their confidence. In my experience, conversations with friends also become shorter and less meaningful when everyone is looking at their phone.',
      },
    ],
  },
  {
    id: 'ad04',
    title: 'Protecting the environment',
    subject: 'environmental science',
    professor: 'Dr. Okafor',
    question:
      'We have been discussing different approaches to solving environmental problems. Some people believe that meaningful change depends mainly on government actions, such as laws that limit pollution and investments in clean energy. Others argue that individual choices — like recycling, driving less, and consuming less — are the key to protecting the environment. Which do you think matters more: government action or individual action?',
    students: [
      {
        name: 'Nina',
        text: 'I think government action is far more important. One factory can pollute more than thousands of families, and only laws can force companies to change their behavior. Governments can also build public transportation and support solar and wind energy on a scale that no individual could ever achieve. Without strong policies, individual efforts remain symbolic.',
      },
      {
        name: 'Tom',
        text: 'I believe individual action is the real foundation of change. Governments only respond when citizens show they care, so our daily choices send a powerful message. When millions of people recycle, buy fewer products, and choose bicycles over cars, companies notice and adapt. Waiting for politicians to solve everything is just an excuse to do nothing.',
      },
    ],
  },
  {
    id: 'ad05',
    title: 'Free university education',
    subject: 'economics',
    professor: 'Dr. Bennett',
    question:
      'In some countries, university education is free for all students, while in others, students must pay significant tuition fees. Supporters of free university education say it gives everyone an equal chance to succeed. Critics argue that it is too expensive for taxpayers and that students value their education more when they pay for it. Do you think university education should be free for everyone?',
    students: [
      {
        name: 'Ava',
        text: 'I strongly believe university should be free. Talented students from poor families often give up on higher education simply because they cannot afford it, and society loses future doctors, engineers, and teachers. Education benefits the whole country through higher productivity and lower unemployment, so it makes sense to fund it with taxes, just like schools and hospitals.',
      },
      {
        name: 'Daniel',
        text: "I'm not convinced that free university is the best policy. Someone always has to pay, and taxpayers include workers who never attended university themselves, which seems unfair. Also, when education is completely free, some students choose degrees casually and drop out easily. A better solution would be low-interest loans and scholarships for students who truly need support.",
      },
    ],
  },
  {
    id: 'ad06',
    title: 'Artificial intelligence in education',
    subject: 'education technology',
    professor: 'Dr. Ito',
    question:
      'Artificial intelligence tools can now answer questions, explain difficult concepts, and even write essays. Some educators believe AI will improve learning by giving every student a personal tutor. Others worry that students will rely on AI to do their work and stop developing their own thinking skills. Should schools encourage or restrict the use of AI tools by students?',
    students: [
      {
        name: 'Grace',
        text: 'I think schools should embrace AI tools. Not every family can afford a private tutor, but AI can explain a math problem ten different ways until a student understands it, at any hour of the day. Banning it is pointless anyway, because students will use it at home. Instead, teachers should show students how to use it responsibly.',
      },
      {
        name: 'Hassan',
        text: 'In my opinion, schools should strictly limit AI use. Learning happens through struggle: when students wrestle with an essay or a problem set, they build thinking skills that last a lifetime. If AI writes for them, they may graduate without being able to argue or analyze independently. Convenience today could mean incompetence tomorrow.',
      },
    ],
  },
  {
    id: 'ad07',
    title: 'Cars vs. public transportation',
    subject: 'urban planning',
    professor: 'Dr. Haddad',
    question:
      'Many growing cities face serious traffic congestion and air pollution. City governments have limited budgets and must decide where to invest. Some experts recommend building more roads and parking to accommodate cars, while others say cities should invest mainly in public transportation like buses and metro lines. If your city had to choose, which investment do you think would be better?',
    students: [
      {
        name: 'Elena',
        text: 'I believe investing in public transportation is clearly better. A single metro line can move as many people as a ten-lane highway while producing far less pollution. Good buses and trains also help students, elderly people, and low-income workers who cannot afford cars. Cities like Tokyo prove that excellent public transit makes daily life faster and cleaner.',
      },
      {
        name: 'Jake',
        text: "I think roads deserve the investment. In most cities, people's jobs, schools, and shops are spread out in ways that buses simply cannot cover, and families with children or elderly relatives genuinely need cars. When roads are too narrow, deliveries are late and ambulances get stuck. Better roads benefit everyone, including bus riders.",
      },
    ],
  },
  {
    id: 'ad08',
    title: 'Funding space exploration',
    subject: 'public policy',
    professor: 'Dr. Novak',
    question:
      'Governments around the world spend billions of dollars on space exploration programs. Supporters argue that space research produces valuable scientific knowledge and new technologies that improve life on Earth. Critics say this money should be spent instead on urgent problems such as poverty, disease, and climate change. Do you think spending large amounts of public money on space exploration is justified?',
    students: [
      {
        name: 'Maya',
        text: 'I fully support space funding. Space programs gave us weather satellites, GPS, and countless medical technologies that we use every day. They also inspire young people to study science and engineering, which strengthens the whole economy. The money is not thrown into space — it is spent on Earth, creating jobs and knowledge.',
      },
      {
        name: 'Oliver',
        text: 'I find it difficult to justify space budgets when basic problems remain unsolved. Millions of people still lack clean water, hospitals, and decent schools. A fraction of the cost of a Mars mission could vaccinate entire countries. Exploration can wait; a child suffering from a preventable disease cannot. Governments should fix Earth first.',
      },
    ],
  },
  {
    id: 'ad09',
    title: 'Part-time jobs for students',
    subject: 'psychology',
    professor: 'Dr. Silva',
    question:
      'Many university students work part-time jobs while studying. Some people believe this is valuable because students earn money and gain real-world experience. Others argue that working takes time and energy away from academic success, which should be the priority. In your opinion, should university students work part-time while studying?',
    students: [
      {
        name: 'Chloe',
        text: 'I believe part-time work is one of the best things a student can do. My campus job taught me time management, teamwork, and how to deal with difficult customers — skills no lecture could teach. Earning my own money also made me more independent and less stressed about expenses, which actually helped my studies.',
      },
      {
        name: 'Ryan',
        text: 'I would caution against working during the semester. Studying is already a full-time commitment, and students who work long shifts often come to class exhausted or skip it entirely. Grades and graduation open doors for an entire career, while most student jobs teach repetitive tasks. Summer jobs are a smarter way to gain experience.',
      },
    ],
  },
  {
    id: 'ad10',
    title: 'Do grades help learning?',
    subject: 'education',
    professor: 'Dr. Laurent',
    question:
      'Schools have traditionally used grades to measure and motivate student learning. Some educators argue that grades push students to work hard and give universities a clear way to evaluate applicants. Others believe grades create anxiety and encourage memorization instead of real understanding, and that written feedback would be more useful. Do you think traditional grades help or harm student learning?',
    students: [
      {
        name: 'Isabella',
        text: 'I think grades are necessary and helpful. Without clear scores, many students would simply do the minimum, and hardworking students would not be recognized for their effort. Grades also give a common standard: a university in one city can understand what a student from another city achieved. Feedback is nice, but numbers create motivation.',
      },
      {
        name: 'Noah',
        text: 'In my experience, grades often harm real learning. Students choose easy courses to protect their average and cram facts the night before a test, forgetting everything a week later. Some classmates with brilliant ideas stay silent because they fear a bad mark. Detailed feedback tells you how to improve; a letter grade only tells you to worry.',
      },
    ],
  },
  {
    id: 'ad11',
    title: 'City life vs. countryside',
    subject: 'human geography',
    professor: 'Dr. Petrov',
    question:
      'People often debate whether it is better to live in a large city or in the countryside. Cities offer more jobs, entertainment, and services, but they are also crowded, expensive, and polluted. Rural areas offer nature, space, and quiet, but fewer opportunities. For a young person starting their career, which do you think is the better place to live?',
    students: [
      {
        name: 'Zoe',
        text: 'For a young person, I believe the city is the obvious choice. Careers are built on opportunities, and cities concentrate the best companies, universities, and professional networks. If you lose one job, ten others are nearby. Beyond work, cities offer museums, concerts, and people from all over the world, which helps young people grow.',
      },
      {
        name: 'Ben',
        text: 'I would actually recommend the countryside, especially now that remote work is common. A young person can keep a city salary while paying half the rent, breathing clean air, and avoiding two hours of daily commuting. Stress and noise in cities damage health over time. Real quality of life matters more than having twenty cinemas nearby.',
      },
    ],
  },
  {
    id: 'ad12',
    title: 'The influence of advertising',
    subject: 'media studies',
    professor: 'Dr. Ramos',
    question:
      'Advertising is everywhere: on streets, websites, videos, and social media. Some people say advertising is useful because it informs consumers about new products and supports free content and services. Others argue that it manipulates people into buying things they do not need and creates constant dissatisfaction. Overall, do you think advertising does more good or more harm to society?',
    students: [
      {
        name: 'Lily',
        text: 'I think advertising provides real benefits. Without ads, we would not know about new medicines, safer cars, or cheaper alternatives to what we already buy. Advertising also pays for the free apps, search engines, and news websites we all use daily. Companies compete for our attention, and that competition often lowers prices.',
      },
      {
        name: 'Victor',
        text: 'In my view, advertising mostly harms society. Its true goal is not to inform but to create desire, often by making people feel incomplete without a product. Children are especially vulnerable to these messages. The result is debt, waste, and endless consumption that damages both family budgets and the environment.',
      },
    ],
  },
  {
    id: 'ad13',
    title: 'Public funding for the arts',
    subject: 'cultural studies',
    professor: 'Dr. Kim',
    question:
      'Many governments use public money to support museums, theaters, orchestras, and other cultural institutions. Supporters say the arts preserve a nation’s identity and should be accessible to everyone, not only the wealthy. Critics argue that public money should go to essential services, and that the arts should survive on ticket sales and private donations. Should governments fund the arts with taxpayer money?',
    students: [
      {
        name: 'Hana',
        text: 'I strongly support public funding for the arts. Museums and theaters educate us about history and human experience in ways textbooks cannot, and government support keeps tickets affordable for students and families. Culture also attracts tourism, which brings money back into the economy. A country that only funds practical things loses its soul.',
      },
      {
        name: 'George',
        text: 'I believe the arts should compete for support like everything else. When hospitals lack nurses and schools lack teachers, spending tax money on opera tickets is hard to defend, especially since audiences are often wealthy anyway. If art is truly valuable to people, they will pay for it, and private sponsors will step in.',
      },
    ],
  },
  {
    id: 'ad14',
    title: 'The four-day workweek',
    subject: 'organizational behavior',
    professor: 'Dr. Fischer',
    question:
      'Several companies and even some governments have experimented with a four-day workweek, where employees work fewer days for the same salary. Supporters claim workers become happier and just as productive. Skeptics argue that many services need constant coverage and that businesses would lose money and competitiveness. Do you think the four-day workweek should become standard?',
    students: [
      {
        name: 'Amara',
        text: 'I think the four-day week is the future. Trials in several countries showed that tired workers waste hours anyway, while rested workers finish the same tasks in less time. An extra free day means better health, more family time, and fewer burnouts, which also saves companies money on sick leave and staff turnover.',
      },
      {
        name: 'Peter',
        text: 'I doubt this model can work everywhere. Hospitals, restaurants, factories, and delivery services cannot simply close for three days, so those employees would either work anyway or companies would hire more staff at a huge cost. It may suit office workers, but making it a national standard would divide the workforce unfairly.',
      },
    ],
  },
  {
    id: 'ad15',
    title: 'Online vs. in-person classes',
    subject: 'higher education',
    professor: 'Dr. Mensah',
    question:
      'Universities now offer many courses online, and some students complete entire degrees without visiting a campus. Some people believe online learning is the future because it is flexible and affordable. Others insist that in-person classes provide better discussion, motivation, and connection between students and professors. Which form of learning do you believe is more effective for university students?',
    students: [
      {
        name: 'Yuki',
        text: 'I find online learning more effective for today’s students. You can pause a recorded lecture, rewatch difficult parts, and study at the hours when your mind works best. Students who work or live far from campus finally have equal access to good universities. The flexibility alone makes online education a life-changing option.',
      },
      {
        name: 'Carlos',
        text: 'For me, in-person classes are clearly superior. Sitting in a real classroom creates discipline that a bedroom desk never will, and spontaneous debates with classmates teach you to think on your feet. Professors also notice when students are confused and adjust immediately. Most online students I know watch lectures half-distracted, with the camera off.',
      },
    ],
  },
]

export function discussionIntro(t) {
  return `Your professor is teaching a class on ${t.subject}. Write a post responding to the professor's question.`
}
