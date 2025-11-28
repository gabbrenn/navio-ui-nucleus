import { useState } from 'react';
import { Megaphone, Target, Users, Calendar, TrendingUp, Eye, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Spinner } from './ui/spinner';

interface CampaignFormProps {
  onSubmit?: (data: any) => void;
}

const CampaignForm = ({ onSubmit }: CampaignFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    campaignType: '',
    targetAudience: '',
    startDate: '',
    endDate: '',
    platforms: [],
    budget: '',
    goals: '',
    kpis: [],
    keywords: []
  });

  const [platformInput, setPlatformInput] = useState('');
  const [kpiInput, setKpiInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const campaignTypes = [
    'Awareness Campaign',
    'Safety Education',
    'Community Mobilization',
    'Emergency Response',
    'Prevention Program',
    'Advocacy Campaign'
  ];

  const audiences = [
    'Youth (13-17)',
    'Young Adults (18-24)', 
    'Parents & Guardians',
    'Educators',
    'Community Leaders',
    'Schools & Institutions',
    'General Public'
  ];

  const platforms = ['Social Media', 'SMS/Text', 'Email', 'Community Events', 'School Programs', 'Partner Organizations'];

  const addPlatform = () => {
    if (platformInput.trim() && !formData.platforms.includes(platformInput.trim())) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platformInput.trim()]
      }));
      setPlatformInput('');
    }
  };

  const removePlatform = (platformToRemove) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter(platform => platform !== platformToRemove)
    }));
  };

  const addKpi = () => {
    if (kpiInput.trim() && !formData.kpis.includes(kpiInput.trim())) {
      setFormData(prev => ({
        ...prev,
        kpis: [...prev.kpis, kpiInput.trim()]
      }));
      setKpiInput('');
    }
  };

  const removeKpi = (kpiToRemove) => {
    setFormData(prev => ({
      ...prev,
      kpis: prev.kpis.filter(kpi => kpi !== kpiToRemove)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="w-8 h-8 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-800">Launch Safety Campaign</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type <span className="text-red-500">*</span>
            </label>
            <Select value={formData.campaignType} onValueChange={(value) => setFormData({...formData, campaignType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe your campaign goals, objectives, and key messages..."
            className="min-h-[120px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Who is this campaign for?" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range (KES)
            </label>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({...formData, budget: e.target.value})}
              placeholder="Enter estimated budget"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distribution Platforms
          </label>
          <div className="flex gap-2 mb-2">
            <Select onValueChange={setPlatformInput}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Add platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms
                  .filter(platform => !formData.platforms.includes(platform))
                  .map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addPlatform} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platform}
                <button
                  type="button"
                  onClick={() => removePlatform(platform)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Goals <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.goals}
            onChange={(e) => setFormData({...formData, goals: e.target.value})}
            placeholder="Describe your primary objectives and expected outcomes..."
            className="min-h-[100px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Performance Indicators (KPIs)
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={kpiInput}
              onChange={(e) => setKpiInput(e.target.value)}
              placeholder="Add KPI (e.g., Reach 10,000 people)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKpi())}
            />
            <Button type="button" onClick={addKpi} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.kpis.map((kpi) => (
              <Badge key={kpi} variant="outline" className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {kpi}
                <button
                  type="button"
                  onClick={() => removeKpi(kpi)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add search keyword"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" onClick={addKeyword} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                <Share2 className="w-3 h-3" />
                {keyword}
                <button
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Campaign Analytics Preview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-green-600" />
              <span>Duration: <strong>{formData.startDate && formData.endDate ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}` : 'Not set'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-600" />
              <span>Audience: <strong>{formData.targetAudience || 'Not selected'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span>Platforms: <strong>{formData.platforms.length || 0}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>KPIs: <strong>{formData.kpis.length || 0}</strong></span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4" />
              Launching...
            </span>
          ) : (
            'Launch Campaign'
          )}
        </Button>
      </form>
    </div>
  );
};

export default CampaignForm;