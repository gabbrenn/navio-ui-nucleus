import { useState } from 'react';
import { toast } from 'sonner';

export default function RiskIndicator() {
  const [formData, setFormData] = useState({
    digitalHarm: '',
    platform: '',
    frequency: '',
    safetyFeeling: 3,
    escalatingRisk: '',
    canBlockReport: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSafetyFeelingChange = (rating) => {
    setFormData((prev) => ({ ...prev, safetyFeeling: rating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Violence Risk Indicators Data:', formData);
    toast.success('Your feedback has been submitted successfully.');
    // Reset form
    setFormData({
      digitalHarm: '',
      platform: '',
      frequency: '',
      safetyFeeling: 3,
      escalatingRisk: '',
      canBlockReport: false,
    });
  };

  return (
    <div className='space-y-4'>
      <div className='max-w-2xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold mb-6'>Violence Risk Indicators (Non-identifying)</h1>
        <p className='text-muted-foreground mb-8'>Your privacy is important. All information shared is anonymous and helps us improve safety for everyone.</p>
        
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='space-y-2'>
            <label htmlFor='digitalHarm' className='text-sm font-medium'>Type of digital harm you experience</label>
            <select
              id='digitalHarm'
              name='digitalHarm'
              value={formData.digitalHarm}
              onChange={handleChange}
              required
              className='w-full p-2 border rounded-md bg-background text-foreground'
            >
              <option value='' disabled>Select a type</option>
              <option value='harassment'>Harassment</option>
              <option value='cyberbullying'>Cyberbullying</option>
              <option value='sextortion-threats'>Sextortion Threats</option>
              <option value='impersonation'>Impersonation</option>
              <option value='doxxing'>Doxxing</option>
            </select>
          </div>

          <div className='space-y-2'>
            <label htmlFor='platform' className='text-sm font-medium'>Platform where harm occurred</label>
            <select
              id='platform'
              name='platform'
              value={formData.platform}
              onChange={handleChange}
              required
              className='w-full p-2 border rounded-md bg-background text-foreground'
            >
              <option value='' disabled>Select a platform</option>
              <option value='whatsapp'>WhatsApp</option>
              <option value='instagram'>Instagram</option>
              <option value='tiktok'>TikTok</option>
              <option value='facebook'>Facebook</option>
            </select>
          </div>

          <div className='space-y-2'>
            <label htmlFor='frequency' className='text-sm font-medium'>Frequency of harmful encounters</label>
            <input
              type='text'
              id='frequency'
              name='frequency'
              value={formData.frequency}
              onChange={handleChange}
              placeholder='e.g., daily, weekly, once a month'
              required
              className='w-full p-2 border rounded-md bg-background text-foreground'
            />
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>How safe do you feel online?</label>
            <div className='flex flex-wrap items-center gap-2'>
              <span className='text-muted-foreground'>Not Safe</span>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type='button'
                  onClick={() => handleSafetyFeelingChange(rating)}
                  className={`w-10 h-10 rounded-full border transition-colors ${
                    formData.safetyFeeling >= rating
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {rating}
                </button>
              ))}
              <span className='text-muted-foreground'>Very Safe</span>
            </div>
          </div>

          <div className='space-y-2'>
            <label htmlFor='escalatingRisk' className='text-sm font-medium'>Describe any signs of escalating risk (optional)</label>
            <textarea
              id='escalatingRisk'
              name='escalatingRisk'
              value={formData.escalatingRisk}
              onChange={handleChange}
              rows={4}
              placeholder='e.g., threats becoming more specific, more frequent contact...'
              className='w-full p-2 border rounded-md bg-background text-foreground'
            />
          </div>

          <div className='flex items-center gap-4'>
            <input
              type='checkbox'
              id='canBlockReport'
              name='canBlockReport'
              checked={formData.canBlockReport}
              onChange={handleChange}
              className='h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
            />
            <label htmlFor='canBlockReport' className='text-sm font-medium'>Do you know how to block/report abusers on the app?</label>
          </div>

          <div>
            <button type='submit' className='w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors'>
              Submit Anonymously
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}