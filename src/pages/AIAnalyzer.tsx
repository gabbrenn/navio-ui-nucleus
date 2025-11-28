import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { aiApi } from '@/lib/api/ai';

export default function AIAnalyzer() {
  const [aiText, setAiText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{ result: string; riskLevel: string; confidenceScore?: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeText = async () => {
    if (!aiText.trim()) {
      toast.error('Please paste some text to analyze.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await aiApi.analyze(aiText);
      setAnalysisResult({
        result: result.analysis_result || 'Analysis complete.',
        riskLevel: result.risk_level || 'unknown',
        confidenceScore: result.confidence_score,
      });
      toast.info('Analysis complete.');
    } catch (error) {
      console.error('AI analysis error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
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
              disabled={isAnalyzing}
              className='w-full bg-secondary text-secondary-foreground font-semibold py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Analyzing...
                </span>
              ) : (
                'Analyze Text'
              )}
            </button>
            {analysisResult && (
              <div className={`p-4 border rounded-md ${
                analysisResult.riskLevel === 'high' ? 'bg-red-50 border-red-200 dark:bg-red-900/20' :
                analysisResult.riskLevel === 'medium' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20' :
                'bg-green-50 border-green-200 dark:bg-green-900/20'
              }`}>
                <p className='font-semibold mb-2'>Analysis Result:</p>
                <p className='mb-2'>{analysisResult.result}</p>
                <div className='text-sm text-muted-foreground'>
                  <p>Risk Level: <span className='font-medium capitalize'>{analysisResult.riskLevel}</span></p>
                  {analysisResult.confidenceScore && (
                    <p>Confidence: {analysisResult.confidenceScore.toFixed(0)}%</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}