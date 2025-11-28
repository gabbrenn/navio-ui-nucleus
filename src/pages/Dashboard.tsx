import { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, UserCheck, ChevronRight, Star, Trophy, Target, Clock, CheckCircle, XCircle } from 'lucide-react';
import { quizApi } from '@/lib/api/quiz';
import { toast } from 'sonner';

// Quiz data structure
const quizzes = [
  {
    id: 'digital-safety',
    title: 'Digital Safety Skills',
    description: 'Master the fundamentals of staying safe online',
    icon: <ShieldCheck className="w-12 h-12 text-blue-500" />,
    color: 'bg-blue-100 dark:bg-blue-900/30',
    progress: 75,
    questions: [
      {
        id: 1,
        question: 'What is the strongest password strategy?',
        options: [
          'Use your birthdate and pet name',
          'Dictionary words with numbers',
          '12+ characters with mixed case, numbers, and symbols',
          'Same password for all accounts'
        ],
        correctAnswer: 2,
        explanation: 'Strong passwords should be at least 12 characters long and include uppercase, lowercase, numbers, and symbols.',
        points: 10
      },
      {
        id: 2,
        question: 'When should you enable two-factor authentication?',
        options: [
          'Only for banking apps',
          'For all important accounts',
          'Never, it\'s inconvenient',
          'Only when required by law'
        ],
        correctAnswer: 1,
        explanation: '2FA should be enabled for all important accounts that offer it as an extra security layer.',
        points: 15
      },
      {
        id: 3,
        question: 'What does HTTPS in a URL indicate?',
        options: [
          'High-speed internet connection',
          'Secure, encrypted connection',
          'Home page of the website',
          'High traffic website'
        ],
        correctAnswer: 1,
        explanation: 'HTTPS indicates that the connection between your browser and the website is encrypted and secure.',
        points: 10
      },
      {
        id: 4,
        question: 'How often should you update your software?',
        options: [
          'Only when prompted',
          'Monthly',
          'As soon as updates are available',
          'Never, to avoid bugs'
        ],
        correctAnswer: 2,
        explanation: 'Software updates often contain security patches that protect against newly discovered vulnerabilities.',
        points: 10
      },
      {
        id: 5,
        question: 'What is a safe way to handle public Wi-Fi?',
        options: [
          'Use it freely for everything',
          'Only use it with a VPN',
          'Avoid sensitive activities like banking',
          'Disable all security settings'
        ],
        correctAnswer: 1,
        explanation: 'On public Wi-Fi, avoid accessing sensitive accounts or use a VPN for encryption.',
        points: 15
      }
    ]
  },
  {
    id: 'scam-detection',
    title: 'Scam Detection Ability',
    description: 'Learn to identify and avoid online scams and phishing',
    icon: <ShieldAlert className="w-12 h-12 text-yellow-500" />,
    color: 'bg-yellow-100 dark:bg-yellow-900/30',
    progress: 50,
    questions: [
      {
        id: 1,
        question: 'Which email characteristic suggests a phishing scam?',
        options: [
          'Professional sender address',
          'Personalized greeting',
          'Urgent language and threats',
          'Clear, concise message'
        ],
        correctAnswer: 2,
        explanation: 'Phishing emails often create urgency with threats like "Your account will be suspended!"',
        points: 15
      },
      {
        id: 2,
        question: 'What should you do if you receive a "too good to be true" offer?',
        options: [
          'Act quickly before it expires',
          'Research the company and offer',
          'Share with friends to get referral bonuses',
          'Provide payment info immediately'
        ],
        correctAnswer: 1,
        explanation: 'Always research suspicious offers independently before taking any action.',
        points: 10
      },
      {
        id: 3,
        question: 'How can you verify if a website is legitimate?',
        options: [
          'Check if it has many ads',
          'Look for contact information and reviews',
          'Trust if it appears in search results',
          'Assume it\'s safe if it loads quickly'
        ],
        correctAnswer: 1,
        explanation: 'Legitimate websites typically have clear contact information, reviews, and professional design.',
        points: 10
      },
      {
        id: 4,
        question: 'What is a common sign of tech support scam?',
        options: [
          'Offering free software updates',
          'Calling you randomly about computer issues',
          'Providing clear company information',
          'Asking for your computer model'
        ],
        correctAnswer: 1,
        explanation: 'Legitimate tech companies don\'t call you randomly about issues with your computer.',
        points: 15
      },
      {
        id: 5,
        question: 'Which payment method is safest for online purchases?',
        options: [
          'Wire transfer',
          'Gift cards',
          'Credit card with fraud protection',
          'Cash through mail'
        ],
        correctAnswer: 2,
        explanation: 'Credit cards offer fraud protection and chargeback rights, making them safer than other options.',
        points: 10
      }
    ]
  },
  {
    id: 'social-privacy',
    title: 'Social Media Privacy',
    description: 'Control your digital footprint and protect your privacy',
    icon: <UserCheck className="w-12 h-12 text-green-500" />,
    color: 'bg-green-100 dark:bg-green-900/30',
    progress: 25,
    questions: [
      {
        id: 1,
        question: 'What privacy setting should you check first on social media?',
        options: [
          'Profile visibility',
          'Location services',
          'Friend/follower permissions',
          'Notification settings'
        ],
        correctAnswer: 0,
        explanation: 'Profile visibility is the most important setting as it controls who can see your basic information.',
        points: 10
      },
      {
        id: 2,
        question: 'When should you avoid posting on social media?',
        options: [
          'When feeling emotional',
          'When traveling away from home',
          'When using public computers',
          'Always wait 24 hours before posting'
        ],
        correctAnswer: 1,
        explanation: 'Avoid posting when traveling, as it can inform criminals that your home might be empty.',
        points: 15
      },
      {
        id: 3,
        question: 'What does "geotagging" refer to?',
        options: [
          'Tagging friends in photos',
          'Adding location data to posts',
          'Blocking certain content',
          'Filtering comments'
        ],
        correctAnswer: 1,
        explanation: 'Geotagging adds location information to your posts, which can reveal your habits and routines.',
        points: 10
      },
      {
        id: 4,
        question: 'How should you handle friend requests?',
        options: [
          'Accept all requests to be popular',
          'Only accept people you know personally',
          'Accept requests from anyone with mutual friends',
          'Decline all requests'
        ],
        correctAnswer: 1,
        explanation: 'Only accept friend requests from people you actually know and trust.',
        points: 15
      },
      {
        id: 5,
        question: 'What information should you never share publicly?',
        options: [
          'Your favorite books and movies',
          'Your home address and phone number',
          'Your occupation and hobbies',
          'Your travel preferences'
        ],
        correctAnswer: 1,
        explanation: 'Never share sensitive personal information like your home address or phone number publicly.',
        points: 10
      }
    ]
  }
];

// Achievement system
const achievements = [
  { id: 'first_quiz', name: 'Quiz Novice', description: 'Complete your first quiz', icon: <Star className="w-6 h-6 text-yellow-500" />, points: 50 },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Score 100% on any quiz', icon: <Trophy className="w-6 h-6 text-gold-500" />, points: 100 },
  { id: 'safety_master', name: 'Safety Master', description: 'Complete all digital safety quizzes', icon: <ShieldCheck className="w-6 h-6 text-blue-500" />, points: 200 },
  { id: 'scam_hunter', name: 'Scam Hunter', description: 'Complete all scam detection quizzes', icon: <ShieldAlert className="w-6 h-6 text-yellow-500" />, points: 200 },
  { id: 'privacy_guardian', name: 'Privacy Guardian', description: 'Complete all privacy quizzes', icon: <UserCheck className="w-6 h-6 text-green-500" />, points: 200 },
  { id: 'quick_learner', name: 'Quick Learner', description: 'Complete a quiz in under 2 minutes', icon: <Clock className="w-6 h-6 text-purple-500" />, points: 75 }
];

const QuizCard = ({ quiz, onStart }) => (
  <div className={`p-6 rounded-2xl shadow-sm transition-transform transform hover:-translate-y-1 ${quiz.color} cursor-pointer`} onClick={() => onStart(quiz)}>
    <div className="flex items-start justify-between">
      <div className="flex-shrink-0">{quiz.icon}</div>
      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{quiz.title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
    </div>
    <div className="mt-6">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{quiz.progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`h-2.5 rounded-full ${
            quiz.title === 'Digital Safety Skills' ? 'bg-blue-500' : 
            quiz.title === 'Scam Detection Ability' ? 'bg-yellow-500' : 'bg-green-500'
          }`} 
          style={{ width: `${quiz.progress}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const QuizModal = ({ quiz, isOpen, onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (isOpen && startTime === null) {
      setStartTime(Date.now());
      const timer = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, startTime]);

  if (!isOpen) return null;

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    const isCorrect = answerIndex === question.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + question.points);
    }

    const newAnswers = [...userAnswers, { questionId: question.id, answer: answerIndex, correct: isCorrect }];
    setUserAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < quiz.questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        // Quiz completed
        const finalScore = isCorrect ? score + question.points : score;
        const completionTime = startTime ? Date.now() - startTime : 0;
        
        onComplete({
          quizId: quiz.id,
          score: finalScore,
          totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
          correctAnswers: newAnswers.filter(a => a.correct).length,
          totalQuestions: quiz.questions.length,
          completionTime: Math.floor(completionTime / 1000),
          answers: newAnswers
        });
        onClose();
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Time: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
              <div className="h-2 rounded-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">{question.question}</h3>
            
            {!showExplanation ? (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className={`p-4 rounded-lg ${
                selectedAnswer === question.correctAnswer
                  ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center mb-2">
                  {selectedAnswer === question.correctAnswer ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                  )}
                  <span className={`font-medium ${
                    selectedAnswer === question.correctAnswer ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                  }`}>
                    {selectedAnswer === question.correctAnswer ? 'Correct!' : 'Incorrect!'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{question.explanation}</p>
                {selectedAnswer === question.correctAnswer && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    +{question.points} points!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Score: {score} points
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {quiz.questions.length - currentQuestion - 1} questions remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, description, icon: Icon, color }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{description}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    quizzesCompleted: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    achievements: [],
    level: 1,
    streak: 0
  });

  const handleQuizStart = (quiz) => {
    setActiveQuiz(quiz);
  };

  const handleQuizComplete = async (results: {
    quizId: string;
    score: number;
    totalPoints: number;
    correctAnswers: number;
    totalQuestions: number;
    completionTime: number;
    answers: unknown[];
  }) => {
    const newPoints = results.score;
    const wasPerfect = results.score === results.totalPoints;
    const accuracy = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    
    // Get user ID
    const userId = localStorage.getItem('user_id') || 'anonymous_' + Date.now();
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
    }

    // Save quiz result to API
    try {
      const quiz = quizzes.find(q => q.id === results.quizId);
      await quizApi.submitResult({
        user_id: userId,
        quiz_id: results.quizId,
        quiz_title: quiz?.title,
        score: results.score,
        total_points: results.totalPoints,
        correct_answers: results.correctAnswers,
        total_questions: results.totalQuestions,
        completion_time: results.completionTime,
        answers: results.answers,
      });
    } catch (error) {
      console.error('Failed to save quiz result:', error);
      toast.error('Failed to save quiz result, but your progress is still tracked locally.');
    }
    
    setUserStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + newPoints,
      quizzesCompleted: prev.quizzesCompleted + 1,
      correctAnswers: prev.correctAnswers + results.correctAnswers,
      totalQuestions: prev.totalQuestions + results.totalQuestions,
      level: Math.floor((prev.totalPoints + newPoints) / 500) + 1,
      streak: wasPerfect ? prev.streak + 1 : 0,
      achievements: [...prev.achievements].filter(a => a.id !== 'quick_learner')
    }));

    // Award achievements
    const newAchievements = [];
    if (userStats.quizzesCompleted === 0) {
      newAchievements.push(achievements.find(a => a.id === 'first_quiz'));
    }
    if (wasPerfect) {
      newAchievements.push(achievements.find(a => a.id === 'perfect_score'));
    }
    if (results.completionTime < 120) {
      newAchievements.push(achievements.find(a => a.id === 'quick_learner'));
    }

    if (newAchievements.length > 0) {
      setUserStats(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }

    // Update quiz progress
    const quizIndex = quizzes.findIndex(q => q.id === results.quizId);
    if (quizIndex !== -1) {
      quizzes[quizIndex].progress = 100;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back to Navio!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Enhance your digital safety with our fun, gamified quizzes.
          </p>
        </div>

        {/* User Stats and Level */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Level"
            value={userStats.level}
            description={`Streak: ${userStats.streak} days`}
            icon={Target}
            color="bg-purple-100 dark:bg-purple-900/30"
          />
          <StatsCard
            title="Total Points"
            value={userStats.totalPoints}
            description="Keep learning!"
            icon={Star}
            color="bg-yellow-100 dark:bg-yellow-900/30"
          />
          <StatsCard
            title="Quizzes Completed"
            value={userStats.quizzesCompleted}
            description="Stay safe online"
            icon={Trophy}
            color="bg-green-100 dark:bg-green-900/30"
          />
          <StatsCard
            title="Accuracy Rate"
            value={`${Math.round(userStats.correctAnswers / Math.max(userStats.totalQuestions, 1) * 100)}%`}
            description="Great job!"
            icon={CheckCircle}
            color="bg-blue-100 dark:bg-blue-900/30"
          />
        </div>

        {/* Achievements Section */}
        {userStats.achievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userStats.achievements.slice(-3).map((achievement, index) => (
                <div key={index} className="flex items-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="mr-3">{achievement.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">+{achievement.points} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Safe Quizzes & Skill Assessments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onStart={handleQuizStart} />
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Your Learning Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                <div className="flex items-center mb-4">
                  {quiz.icon}
                  <h3 className="ml-3 font-medium text-gray-900 dark:text-white">{quiz.title}</h3>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{quiz.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${
                        quiz.title === 'Digital Safety Skills' ? 'bg-blue-500' : 
                        quiz.title === 'Scam Detection Ability' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${quiz.progress}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {quiz.questions.length} questions • {quiz.progress === 100 ? 'Completed' : 'In Progress'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Modal */}
        {activeQuiz && (
          <QuizModal
            quiz={activeQuiz}
            isOpen={true}
            onClose={() => setActiveQuiz(null)}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
}
