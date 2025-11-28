import { useState } from 'react';
import { MessageCircle, Users, Calendar, Clock, TrendingUp, BarChart3, Mic, Video } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Spinner } from './ui/spinner';

interface SessionFormProps {
  onSubmit?: (data: any) => void;
}

const SessionForm = ({ onSubmit }: SessionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionType: '',
    topic: '',
    maxParticipants: '',
    duration: '',
    scheduledDate: '',
    scheduledTime: '',
    facilitator: '',
    targetAudience: '',
    expectedOutcomes: '',
    engagementMetrics: [],
    resources: [],
    tags: []
  });

  const [metricInput, setMetricInput] = useState('');
  const [resourceInput, setResourceInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const sessionTypes = [
    'Live Q&A Session',
    'Expert Discussion',
    'Youth Panel',
    'Safety Workshop',
    'Community Forum',
    'Training Session',
    'Crisis Support'
  ];

  const topics = [
    'Personal Safety',
    'Mental Health & Wellness',
    'Digital Security',
    'Community Safety',
    'Emergency Response',
    'Anti-Bullying',
    'Online Safety',
    'Health Education'
  ];

  const audiences = [
    'Youth (13-17)',
    'Young Adults (18-24)',
    'Parents & Guardians',
    'Educators',
    'Community Leaders',
    'School Groups',
    'Mixed Ages'
  ];

  const durations = [
    '30 minutes',
    '45 minutes', 
    '60 minutes',
    '90 minutes',
    '2 hours',
    'Custom'
  ];

  const addMetric = () => {
    if (metricInput.trim() && !formData.engagementMetrics.includes(metricInput.trim())) {
      setFormData(prev => ({
        ...prev,
        engagementMetrics: [...prev.engagementMetrics, metricInput.trim()]
      }));
      setMetricInput('');
    }
  };

  const removeMetric = (metricToRemove) => {
    setFormData(prev => ({
      ...prev,
      engagementMetrics: prev.engagementMetrics.filter(metric => metric !== metricToRemove)
    }));
  };

  const addResource = () => {
    if (resourceInput.trim() && !formData.resources.includes(resourceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, resourceInput.trim()]
      }));
      setResourceInput('');
    }
  };

  const removeResource = (resourceToRemove) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource !== resourceToRemove)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
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
        <MessageCircle className="w-8 h-8 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-800">Start Live Session</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Title <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter session title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Type <span className="text-red-500">*</span>
            </label>
            <Select value={formData.sessionType} onValueChange={(value) => setFormData({...formData, sessionType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Topic <span className="text-red-500">*</span>
            </label>
            <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select main topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Audience <span className="text-red-500">*</span>
            </label>
            <Select value={formData.targetAudience} onValueChange={(value) => setFormData({...formData, targetAudience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Who is this session for?" />
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Participants
            </label>
            <Input
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
              placeholder="Maximum attendees"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({...formData, duration: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {durations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilitator
            </label>
            <Input
              value={formData.facilitator}
              onChange={(e) => setFormData({...formData, facilitator: e.target.value})}
              placeholder="Session facilitator name"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <Input
              type="time"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Description <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Describe the session format, goals, and key discussion points..."
            className="min-h-[120px]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Outcomes
          </label>
          <Textarea
            value={formData.expectedOutcomes}
            onChange={(e) => setFormData({...formData, expectedOutcomes: e.target.value})}
            placeholder="What participants should learn or achieve..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Engagement Metrics
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={metricInput}
              onChange={(e) => setMetricInput(e.target.value)}
              placeholder="Add metric (e.g., Questions asked: 20)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMetric())}
            />
            <Button type="button" onClick={addMetric} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.engagementMetrics.map((metric) => (
              <Badge key={metric} variant="outline" className="flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                {metric}
                <button
                  type="button"
                  onClick={() => removeMetric(metric)}
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
            Required Resources
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={resourceInput}
              onChange={(e) => setResourceInput(e.target.value)}
              placeholder="Add resource (e.g., Presentation slides, Worksheets)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResource())}
            />
            <Button type="button" onClick={addResource} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.resources.map((resource) => (
              <Badge key={resource} variant="secondary" className="flex items-center gap-1">
                <Mic className="w-3 h-3" />
                {resource}
                <button
                  type="button"
                  onClick={() => removeResource(resource)}
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
            Session Tags
          </label>
          <div className="flex gap-2 mb-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add relevant tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-800">Session Analytics Preview</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Date: <strong>{formData.scheduledDate || 'Not set'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Duration: <strong>{formData.duration || 'Not selected'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Audience: <strong>{formData.targetAudience || 'Not selected'}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <span>Metrics: <strong>{formData.engagementMetrics.length || 0}</strong></span>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner className="w-4 h-4" />
              Scheduling...
            </span>
          ) : (
            'Start Session'
          )}
        </Button>
      </form>
    </div>
  );
};

export default SessionForm;