import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { panicApi } from '@/lib/api/panic';

const PanicInfo = () => {
  const [emergencyHotline, setEmergencyHotline] = useState('');
  const [trustedFriend, setTrustedFriend] = useState('');
  const [legalSupport, setLegalSupport] = useState('');
  const [digitalViolenceHelpline, setDigitalViolenceHelpline] = useState('');
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPermanent, setIsSavingPermanent] = useState(false);
  
  // New permanent fields
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  
  // State to track if permanent details are saved
  const [permanentDetailsSaved, setPermanentDetailsSaved] = useState(false);

  useEffect(() => {
    const savedInfo = localStorage.getItem('panicInfo');
    if (savedInfo) {
      const { emergencyHotline, trustedFriend, legalSupport, digitalViolenceHelpline } = JSON.parse(savedInfo);
      setEmergencyHotline(emergencyHotline || '');
      setTrustedFriend(trustedFriend || '');
      setLegalSupport(legalSupport || '');
      setDigitalViolenceHelpline(digitalViolenceHelpline || '');
    }
    
    // Check if permanent details are saved
    const savedPermanentDetails = localStorage.getItem('permanentPanicInfo');
    if (savedPermanentDetails) {
      const { fullName, idNumber, bloodType, medicalConditions, emergencyContactName, emergencyContactRelation, emergencyContactPhone } = JSON.parse(savedPermanentDetails);
      setFullName(fullName || '');
      setIdNumber(idNumber || '');
      setBloodType(bloodType || '');
      setMedicalConditions(medicalConditions || '');
      setEmergencyContactName(emergencyContactName || '');
      setEmergencyContactRelation(emergencyContactRelation || '');
      setEmergencyContactPhone(emergencyContactPhone || '');
      setPermanentDetailsSaved(true);
    }
  }, []);

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Get user ID from localStorage or generate a temporary one
      const userId = localStorage.getItem('user_id') || 'anonymous_' + Date.now();
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', userId);
      }

      await panicApi.upsert({
        user_id: userId,
        emergency_hotline: emergencyHotline || undefined,
        trusted_friend: trustedFriend || undefined,
        legal_support: legalSupport || undefined,
        digital_violence_helpline: digitalViolenceHelpline || undefined,
        full_name: fullName || undefined,
        id_number: idNumber || undefined,
        blood_type: bloodType || undefined,
        medical_conditions: medicalConditions || undefined,
        emergency_contact_name: emergencyContactName || undefined,
        emergency_contact_relation: emergencyContactRelation || undefined,
        emergency_contact_phone: emergencyContactPhone || undefined,
      });

      // Also save to localStorage as backup
      const panicInfo = {
        emergencyHotline,
        trustedFriend,
        legalSupport,
        digitalViolenceHelpline,
      };
      localStorage.setItem('panicInfo', JSON.stringify(panicInfo));
      toast.success('Panic information saved successfully.');
    } catch (error) {
      console.error('Save panic info error:', error);
      // Fallback to localStorage only
      const panicInfo = {
        emergencyHotline,
        trustedFriend,
        legalSupport,
        digitalViolenceHelpline,
      };
      localStorage.setItem('panicInfo', JSON.stringify(panicInfo));
      toast.warning('Saved locally. API connection failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePermanentDetails = async () => {
    // Validate required fields
    if (!fullName || !idNumber || !bloodType) {
      toast.error('Please fill in all required permanent details (Full Name, ID Number, Blood Type)');
      return;
    }
    
    if (isSavingPermanent) return;
    setIsSavingPermanent(true);
    try {
      const userId = localStorage.getItem('user_id') || 'anonymous_' + Date.now();
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', userId);
      }

      await panicApi.upsert({
        user_id: userId,
        full_name: fullName,
        id_number: idNumber,
        blood_type: bloodType,
        medical_conditions: medicalConditions || undefined,
        emergency_contact_name: emergencyContactName || undefined,
        emergency_contact_relation: emergencyContactRelation || undefined,
        emergency_contact_phone: emergencyContactPhone || undefined,
        emergency_hotline: emergencyHotline || undefined,
        trusted_friend: trustedFriend || undefined,
        legal_support: legalSupport || undefined,
        digital_violence_helpline: digitalViolenceHelpline || undefined,
      });

      // Also save to localStorage as backup
      const permanentDetails = {
        fullName,
        idNumber,
        bloodType,
        medicalConditions,
        emergencyContactName,
        emergencyContactRelation,
        emergencyContactPhone,
      };
      localStorage.setItem('permanentPanicInfo', JSON.stringify(permanentDetails));
      setPermanentDetailsSaved(true);
      toast.success('Permanent details saved successfully.');
    } catch (error) {
      console.error('Save permanent details error:', error);
      // Fallback to localStorage only
      const permanentDetails = {
        fullName,
        idNumber,
        bloodType,
        medicalConditions,
        emergencyContactName,
        emergencyContactRelation,
        emergencyContactPhone,
      };
      localStorage.setItem('permanentPanicInfo', JSON.stringify(permanentDetails));
      setPermanentDetailsSaved(true);
      toast.warning('Saved locally. API connection failed.');
    } finally {
      setIsSavingPermanent(false);
    }
  };

  const resetPermanentDetails = () => {
    localStorage.removeItem('permanentPanicInfo');
    setPermanentDetailsSaved(false);
    setFullName('');
    setIdNumber('');
    setBloodType('');
    setMedicalConditions('');
    setEmergencyContactName('');
    setEmergencyContactRelation('');
    setEmergencyContactPhone('');
    toast.success('Permanent details reset. You can now enter new details.');
  };

  const sendEmergencyAlert = async () => {
    // Collect all filled contact fields
    const contacts = [];
    
    if (emergencyHotline) {
      contacts.push({ type: 'Emergency Hotline', value: emergencyHotline });
    }
    if (trustedFriend) {
      contacts.push({ type: 'Trusted Friend', value: trustedFriend });
    }
    if (legalSupport) {
      contacts.push({ type: 'Legal Support', value: legalSupport });
    }
    if (digitalViolenceHelpline) {
      contacts.push({ type: 'Digital Violence Helpline', value: digitalViolenceHelpline });
    }

    // Validate that at least one contact is filled
    if (contacts.length === 0) {
      toast.error('Please add at least one emergency contact before sending an alert.');
      return;
    }

    setIsSendingAlert(true);
    
    try {
      // Simulate alert sending process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Build comprehensive personal details section
      let personalDetailsSection = '';
      if (permanentDetailsSaved) {
        personalDetailsSection = `PERSONAL DETAILS:
Full Name: ${fullName}
ID Number: ${idNumber}
Blood Type: ${bloodType}
${medicalConditions ? `Medical Conditions: ${medicalConditions}` : ''}
${emergencyContactName ? `Emergency Contact: ${emergencyContactName} (${emergencyContactRelation})` : ''}
${emergencyContactPhone ? `Contact Phone: ${emergencyContactPhone}` : ''}
`;
      } else {
        personalDetailsSection = `PERSONAL DETAILS:
Note: Permanent personal details not saved. This user may not be able to provide identification or critical medical information in an emergency.
`;
      }
      
      // Create comprehensive alert message with personal details
      const alertMessage = `🚨 EMERGENCY ALERT 🚨
      
This is an automated emergency alert from your safety application.

Alert sent on: ${new Date().toLocaleString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}

Please provide immediate assistance if this is a genuine emergency.

---

${personalDetailsSection}

---

EMERGENCY CONTACTS:
${contacts.map(contact => `• ${contact.type}: ${contact.value}`).join('\n')}

---

This is an automated message from your safety application. Please respond immediately to this alert if you are the recipient.`;

      // In a real application, this would integrate with SMS/email services
      // For now, we'll show a notification and log the alert
      console.log('Emergency Alert:', alertMessage);
      
      // Show success notification
      toast.success(`Emergency alert with personal details sent successfully to ${contacts.length} contact(s)!`);
      
      // Show detailed alert in a dialog (for demo purposes)
      alert(alertMessage);
      
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      toast.error('Failed to send emergency alert. Please try again.');
    } finally {
      setIsSendingAlert(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto p-4 md:p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
      <h1 className='text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100'>Panic Information Card (Offline Save)</h1>
      <p className='mb-6 text-gray-600 dark:text-gray-400'>
        This information is saved on your device and can be accessed even without an internet connection.
      </p>
      
      {/* Permanent Details Section */}
      <div className='mb-8'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Permanent Personal Details</h2>
          {permanentDetailsSaved && (
            <span className='px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full'>Saved</span>
          )}
        </div>
        
        {!permanentDetailsSaved ? (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='fullName' className='text-gray-700 dark:text-gray-300'>Full Name *</Label>
                <Input
                  id='fullName'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder='Enter your full name'
                  className='dark:bg-gray-800 dark:text-gray-200'
                />
              </div>
              <div>
                <Label htmlFor='idNumber' className='text-gray-700 dark:text-gray-300'>ID Number *</Label>
                <Input
                  id='idNumber'
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder='National ID or Passport'
                  className='dark:bg-gray-800 dark:text-gray-200'
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor='bloodType' className='text-gray-700 dark:text-gray-300'>Blood Type *</Label>
              <Input
                id='bloodType'
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                placeholder='e.g., A+, O-, AB+'
                className='dark:bg-gray-800 dark:text-gray-200'
              />
            </div>
            
            <div>
              <Label htmlFor='medicalConditions' className='text-gray-700 dark:text-gray-300'>Medical Conditions</Label>
              <Input
                id='medicalConditions'
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder='e.g., Diabetes, Allergies, Chronic illnesses'
                className='dark:bg-gray-800 dark:text-gray-200'
              />
            </div>
            
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='emergencyContactName' className='text-gray-700 dark:text-gray-300'>Primary Emergency Contact</Label>
                <Input
                  id='emergencyContactName'
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder='Contact person name'
                  className='dark:bg-gray-800 dark:text-gray-200'
                />
              </div>
              <div>
                <Label htmlFor='emergencyContactRelation' className='text-gray-700 dark:text-gray-300'>Relationship</Label>
                <Input
                  id='emergencyContactRelation'
                  value={emergencyContactRelation}
                  onChange={(e) => setEmergencyContactRelation(e.target.value)}
                  placeholder='e.g., Parent, Spouse, Sibling'
                  className='dark:bg-gray-800 dark:text-gray-200'
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor='emergencyContactPhone' className='text-gray-700 dark:text-gray-300'>Emergency Contact Phone</Label>
              <Input
                id='emergencyContactPhone'
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder='Emergency contact phone number'
                className='dark:bg-gray-800 dark:text-gray-200'
              />
            </div>
            
            <Alert>
              <AlertTriangle className='h-4 w-4' />
              <AlertDescription>
                These details can only be saved once. After saving, they cannot be changed. Please ensure all information is accurate.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={handleSavePermanentDetails} 
              disabled={isSavingPermanent}
              className='w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSavingPermanent ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Saving...
                </span>
              ) : (
                'Save Permanent Details'
              )}
            </Button>
          </div>
        ) : (
          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                </svg>
                <h3 className='font-semibold text-green-800'>Permanent Details Saved</h3>
              </div>
              <Button
                onClick={resetPermanentDetails}
                variant='outline'
                size='sm'
                className='text-red-600 border-red-300 hover:bg-red-50'
              >
                Reset
              </Button>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>Full Name:</span>
                <span className='text-gray-900 dark:text-gray-100'>{fullName}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>ID Number:</span>
                <span className='text-gray-900 dark:text-gray-100'>{idNumber}</span>
              </div>
              <div className='flex justify-between'>
                <span className='font-medium text-gray-700'>Blood Type:</span>
                <span className='text-gray-900 dark:text-gray-100'>{bloodType}</span>
              </div>
              {medicalConditions && (
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-700'>Medical Conditions:</span>
                  <span className='text-gray-900 dark:text-gray-100'>{medicalConditions}</span>
                </div>
              )}
              {emergencyContactName && (
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-700'>Emergency Contact:</span>
                  <span className='text-gray-900 dark:text-gray-100'>{emergencyContactName} ({emergencyContactRelation})</span>
                </div>
              )}
              {emergencyContactPhone && (
                <div className='flex justify-between'>
                  <span className='font-medium text-gray-700'>Contact Phone:</span>
                  <span className='text-gray-900 dark:text-gray-100'>{emergencyContactPhone}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
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
      
      {/* Emergency Alert Section */}
      <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <AlertTriangle className='w-5 h-5 text-red-600' />
            <h3 className='font-semibold text-red-800'>Emergency Alert System</h3>
          </div>
          <p className='text-sm text-red-700 mb-3'>
            When activated, this will send an emergency alert to all filled contacts Above.
            Use this only in genuine emergency situations.
          </p>
          <Alert>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              This is a simulation. In a production environment, this would integrate with SMS, email, or emergency services.
            </AlertDescription>
          </Alert>
        </div>
        
        <Button
          onClick={sendEmergencyAlert}
          disabled={isSendingAlert}
          className='w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSendingAlert ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4" />
              Sending Alert...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle className='w-4 h-4' />
              Send Emergency Alert
            </span>
          )}
        </Button>
      </div>
      
      <Button 
        onClick={handleSave} 
        disabled={isSaving}
        className='mt-4 w-full disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isSaving ? (
          <span className="flex items-center justify-center gap-2">
            <Spinner className="w-4 h-4" />
            Saving...
          </span>
        ) : (
          'Save Information'
        )}
      </Button>
    </div>
  );
};

export default PanicInfo;
