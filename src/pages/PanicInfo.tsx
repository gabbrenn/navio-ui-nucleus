import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PanicInfo = () => {
  const [emergencyHotline, setEmergencyHotline] = useState('');
  const [trustedFriend, setTrustedFriend] = useState('');
  const [legalSupport, setLegalSupport] = useState('');
  const [digitalViolenceHelpline, setDigitalViolenceHelpline] = useState('');

  useEffect(() => {
    const savedInfo = localStorage.getItem('panicInfo');
    if (savedInfo) {
      const { emergencyHotline, trustedFriend, legalSupport, digitalViolenceHelpline } = JSON.parse(savedInfo);
      setEmergencyHotline(emergencyHotline || '');
      setTrustedFriend(trustedFriend || '');
      setLegalSupport(legalSupport || '');
      setDigitalViolenceHelpline(digitalViolenceHelpline || '');
    }
  }, []);

  const handleSave = () => {
    const panicInfo = {
      emergencyHotline,
      trustedFriend,
      legalSupport,
      digitalViolenceHelpline,
    };
    localStorage.setItem('panicInfo', JSON.stringify(panicInfo));
    toast.success('Panic information saved locally. You can access it even when offline.');
  };

  return (
    <div className='max-w-2xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
      <h1 className='text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Panic Information Card (Offline Save)</h1>
      <p className='mb-6 text-gray-600 dark:text-gray-400'>
        This information is saved on your device and can be accessed even without an internet connection.
      </p>
      <div className='space-y-4'>
        <div>
          <Label htmlFor='emergencyHotline' className='text-gray-700 dark:text-gray-300'>Emergency Hotline</Label>
          <Input
            id='emergencyHotline'
            value={emergencyHotline}
            onChange={(e) => setEmergencyHotline(e.target.value)}
            placeholder='e.g., 911, 112'
            className='dark:bg-gray-800 dark:text-gray-200'
          />
        </div>
        <div>
          <Label htmlFor='trustedFriend' className='text-gray-700 dark:text-gray-300'>Trusted Friend</Label>
          <Input
            id='trustedFriend'
            value={trustedFriend}
            onChange={(e) => setTrustedFriend(e.target.value)}
            placeholder='Name and phone number'
            className='dark:bg-gray-800 dark:text-gray-200'
          />
        </div>
        <div>
          <Label htmlFor='legalSupport' className='text-gray-700 dark:text-gray-300'>Legal Support Number</Label>
          <Input
            id='legalSupport'
            value={legalSupport}
            onChange={(e) => setLegalSupport(e.target.value)}
            placeholder='Contact for legal advice'
            className='dark:bg-gray-800 dark:text-gray-200'
          />
        </div>
        <div>
          <Label htmlFor='digitalViolenceHelpline' className='text-gray-700 dark:text-gray-300'>Digital Violence Helpline</Label>
          <Input
            id='digitalViolenceHelpline'
            value={digitalViolenceHelpline}
            onChange={(e) => setDigitalViolenceHelpline(e.target.value)}
            placeholder='e.g., National helpline for online harassment'
            className='dark:bg-gray-800 dark:text-gray-200'
          />
        </div>
      </div>
      <Button onClick={handleSave} className='mt-6 w-full'>
        Save Information
      </Button>
    </div>
  );
};

export default PanicInfo;
