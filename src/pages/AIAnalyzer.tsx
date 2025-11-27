import { useState } from 'react';
import { toast } from 'sonner';

export default function AIAnalyzer() {
  const [aiText, setAiText] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');

  const handleAnalyzeText = () => {
    if (!aiText.trim()) {
      toast.error('Please paste some text to analyze.');
      return;
    }
    const results = [
      'This message looks unsafe',
      'Possible grooming behavior',
      'High risk — do not respond',
    ];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    setAnalysisResult(randomResult);
    toast.info('Analysis complete.');
  };

  return (
    <div className='space-y-4'>
      <div className='max-w-2xl mx-auto'>
        <div className='pt-8'>
          <h2 className='text-2xl font-bold mb-4'>AI Safety Analyzer</h2>
          <p className='text-muted-foreground mb-4'>Paste a suspicious message to get a quick safety analysis. This tool is a simple guide and not a replacement for careful judgment.</p>
          <div className='space-y-4'>
            <textarea
              value={aiText}
              onChange={(e) => setAiText(e.target.value)}
              rows={5}
              placeholder='Paste text here...'
              className='w-full p-2 border rounded-md bg-background text-foreground'
            />
            <button
              onClick={handleAnalyzeText}
              className='w-full bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors'
            >
              Analyze Text
            </button>
            {analysisResult && (
              <div className='p-4 border rounded-md bg-muted text-foreground'>
                <p className='font-semibold'>Analysis Result:</p>
                <p>{analysisResult}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}