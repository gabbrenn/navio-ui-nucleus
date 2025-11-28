import { useState } from 'react';
import { ShieldCheck, MessageCircle, Megaphone } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import TipForm from '@/components/TipForm';
import CampaignForm from '@/components/CampaignForm';
import SessionForm from '@/components/SessionForm';
import { tipsApi } from '@/lib/api/tips';
import { campaignsApi } from '@/lib/api/campaigns';
import { sessionsApi } from '@/lib/api/sessions';

const PartnershipsPage = () => {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (type: string, data: Record<string, unknown>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      switch (type) {
        case 'tip':
          await tipsApi.create({
            title: data.title as string,
            category: data.category as string,
            content: data.content as string,
            target_audience: data.targetAudience as string,
            priority: data.priority as string,
            estimated_impact: data.estimatedImpact as string,
            tags: (data.tags as string[]) || [],
          });
          toast.success('Safety tip submitted successfully!');
          break;
        case 'campaign':
          await campaignsApi.create({
            title: data.title as string,
            description: data.description as string,
            campaign_type: data.campaignType as string,
            target_audience: data.targetAudience as string,
            start_date: data.startDate as string,
            end_date: data.endDate as string,
            platforms: (data.platforms as string[]) || [],
            budget: data.budget as string,
            goals: data.goals as string,
            kpis: (data.kpis as string[]) || [],
            keywords: (data.keywords as string[]) || [],
          });
          toast.success('Campaign created successfully!');
          break;
        case 'session':
          await sessionsApi.create({
            title: data.title as string,
            description: data.description as string,
            session_type: data.sessionType as string,
            topic: data.topic as string,
            max_participants: data.maxParticipants ? parseInt(data.maxParticipants as string) : undefined,
            duration: data.duration as string,
            scheduled_date: data.scheduledDate as string,
            scheduled_time: data.scheduledTime as string,
            facilitator: data.facilitator as string,
            target_audience: data.targetAudience as string,
            expected_outcomes: data.expectedOutcomes as string,
            engagement_metrics: (data.engagementMetrics as string[]) || [],
            resources: (data.resources as string[]) || [],
            tags: (data.tags as string[]) || [],
          });
          toast.success('Session scheduled successfully!');
          break;
        default:
          toast.error('Unknown form type');
      }
      setActiveDialog(null);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='p-4 md:p-8 bg-gray-50'>
      <header className='mb-12 text-center'>
        <h1 className='text-3xl md:text-5xl font-bold text-gray-800'>Amani Connect</h1>
        <p className='text-lg md:text-xl text-gray-600 mt-2'>Verified NGOs Empowering Youth with Safety and Knowledge</p>
      </header>

      <div className='space-y-16'>
        {/* Post Tips Section */}
        <section className='flex flex-col md:flex-row items-center bg-white p-4 md:p-8 rounded-2xl shadow-lg overflow-hidden'>
          <div className='md:w-1/2 p-4 md:p-6'>
            <ShieldCheck className='w-12 h-12 text-blue-500 mb-4' />
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Post Safety Tips</h2>
            <p className='text-gray-600 mb-6'>
              Share practical, verified advice to help youth navigate risks.
              Your tips provide actionable guidance on personal safety, digital security,
              and mental well-being, creating a trusted resource for everyday challenges.
            </p>
            <Dialog open={activeDialog === 'tip'} onOpenChange={(open) => !open && setActiveDialog(null)}>
              <DialogTrigger asChild>
                <button
                  className='bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto'
                  onClick={() => setActiveDialog('tip')}
                >
                  Share a Tip
                </button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-blue-600'>
                    <ShieldCheck className='w-5 h-5' />
                    Share a Safety Tip
                  </DialogTitle>
                  <DialogDescription>
                    Fill out the form below to submit your safety tip with detailed metrics and targeting information.
                  </DialogDescription>
                </DialogHeader>
                <TipForm onSubmit={(data) => handleFormSubmit('tip', data)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className='md:w-1/2 mt-6 md:mt-0'>
            <img src='https://storage.googleapis.com/dala-prod-public-storage/generated-images/2e180f14-1206-44c3-9473-5c82eac1ee1a/partnerships-tips-cv84gb7-1764234051514.webp' alt='Mentor giving advice' className='w-full h-auto object-cover rounded-lg' />
          </div>
        </section>

        {/* Share Campaigns Section */}
        <section className='flex flex-col md:flex-row-reverse items-center bg-white p-4 md:p-8 rounded-2xl shadow-lg overflow-hidden'>
          <div className='md:w-1/2 p-4 md:p-6'>
            <Megaphone className='w-12 h-12 text-green-500 mb-4' />
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Share Safety Campaigns</h2>
            <p className='text-gray-600 mb-6'>
              Amplify your message and reach a wider audience. Launch awareness campaigns
              on critical issues like anti-bullying, online safety, and community health.
              Utilize our platform to mobilize youth and create lasting impact.
            </p>
            <Dialog open={activeDialog === 'campaign'} onOpenChange={(open) => !open && setActiveDialog(null)}>
              <DialogTrigger asChild>
                <button
                  className='bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors w-full md:w-auto'
                  onClick={() => setActiveDialog('campaign')}
                >
                  Launch Campaign
                </button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-green-600'>
                    <Megaphone className='w-5 h-5' />
                    Launch Safety Campaign
                  </DialogTitle>
                  <DialogDescription>
                    Create a comprehensive campaign with detailed targeting, performance metrics, and analytics.
                  </DialogDescription>
                </DialogHeader>
                <CampaignForm onSubmit={(data) => handleFormSubmit('campaign', data)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className='md:w-1/2 mt-6 md:mt-0'>
            <img src='https://storage.googleapis.com/dala-prod-public-storage/generated-images/2e180f14-1206-44c3-9473-5c82eac1ee1a/partnerships-campaigns-4oyxpnt-1764234058372.webp' alt='Safety campaign graphic' className='w-full h-auto object-cover rounded-lg' />
          </div>
        </section>

        {/* Live Q&A Section */}
        <section className='flex flex-col md:flex-row items-center bg-white p-4 md:p-8 rounded-2xl shadow-lg overflow-hidden'>
          <div className='md:w-1/2 p-4 md:p-6'>
            <MessageCircle className='w-12 h-12 text-purple-500 mb-4' />
            <h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-4'>Run Live Q&A Sessions</h2>
            <p className='text-gray-600 mb-6'>
              Engage directly with the community in real-time. Host live Q&A sessions to
              address pressing questions, debunk myths, and provide expert answers on
              sensitive topics in a safe and moderated environment.
            </p>
            <Dialog open={activeDialog === 'session'} onOpenChange={(open) => !open && setActiveDialog(null)}>
              <DialogTrigger asChild>
                <button
                  className='bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors w-full md:w-auto'
                  onClick={() => setActiveDialog('session')}
                >
                  Start a Session
                </button>
              </DialogTrigger>
              <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2 text-purple-600'>
                    <MessageCircle className='w-5 h-5' />
                    Start Live Session
                  </DialogTitle>
                  <DialogDescription>
                    Schedule and configure your live session with engagement metrics and participant analytics.
                  </DialogDescription>
                </DialogHeader>
                <SessionForm onSubmit={(data) => handleFormSubmit('session', data)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className='md:w-1/2 mt-6 md:mt-0'>
            <img src='https://storage.googleapis.com/dala-prod-public-storage/generated-images/2e180f14-1206-44c3-9473-5c82eac1ee1a/partnerships-q-and-a-41siygf-1764234065612.webp' alt='Live Q&A session' className='w-full h-auto object-cover rounded-lg' />
          </div>
        </section>
      </div>
    </div>
  );
};

export default PartnershipsPage;
