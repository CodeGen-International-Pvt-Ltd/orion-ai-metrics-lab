
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, ArrowRight } from "lucide-react";

interface ModelSelectionProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
  testSuites: any[];
  selectedTestSuiteId: string | null;
}

const ModelSelection = ({ selectedModel, setSelectedModel, onNext, onBack, testSuites, selectedTestSuiteId }: ModelSelectionProps) => {
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [endpointError, setEndpointError] = useState('');

  const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteId);
  const isConfidential = selectedTestSuite?.confidentialityStatus || false;

  const models = [
    {
      id: 'OpenAI',
      name: 'OpenAI GPT-4',
      description: 'Advanced language model with excellent reasoning capabilities',
      features: ['High accuracy', 'Complex reasoning', 'Broad knowledge base'],
      recommended: true,
      disabled: isConfidential
    },
    {
      id: 'Claude',
      name: 'Anthropic Claude',
      description: 'Constitutional AI model focused on helpfulness and safety',
      features: ['Safety-focused', 'Nuanced responses', 'Ethical reasoning'],
      recommended: false,
      disabled: isConfidential
    },
    {
      id: 'Custom',
      name: 'Custom LLM Endpoint',
      description: 'Connect to your own custom language model endpoint',
      features: ['Full control', 'Custom configuration', 'Private deployment'],
      recommended: false,
      disabled: false
    }
  ];

  const validateCustomEndpoint = () => {
    if (selectedModel === 'Custom' && !customEndpoint.trim()) {
      setEndpointError('Custom LLM endpoint is required');
      return false;
    }
    
    if (selectedModel === 'Custom') {
      try {
        new URL(customEndpoint);
        setEndpointError('');
        return true;
      } catch {
        setEndpointError('Please enter a valid URL');
        return false;
      }
    }
    
    return true;
  };

  const handleNext = () => {
    if (!validateCustomEndpoint()) {
      return;
    }
    onNext();
  };

  // Auto-select Custom if confidential and no valid model selected
  if (isConfidential && (selectedModel === 'OpenAI' || selectedModel === 'Claude' || !selectedModel)) {
    setSelectedModel('Custom');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Select Evaluation Model
          </CardTitle>
          <CardDescription>
            Choose the AI model that will evaluate your OrionAI system
            {isConfidential && (
              <span className="block mt-2 text-yellow-600 font-medium">
                ⚠️ Confidential test suite detected - External models are disabled
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="relative">
                <div className={`flex items-center space-x-4 p-6 border rounded-lg transition-all ${
                  model.disabled 
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-300' 
                    : `cursor-pointer hover:bg-gray-50 ${
                        selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`
                }`}>
                  <RadioGroupItemAdd commentMore actions
  value={model.id}
  id={model.id}
  disabled={model.disabled}
  className="radio-blue-border"
/>





                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Label 
                        htmlFor={model.id} 
                        className={`text-lg font-semibold ${model.disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {model.name}
                      </Label>
                      {model.recommended && !model.disabled && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          Recommended
                        </span>
                      )}
                      {model.disabled && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                          Disabled (Confidential)
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{model.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {model.features.map((feature) => (
                        <span key={feature} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {/* Custom Endpoint Input */}
          {selectedModel === 'Custom' && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <Label htmlFor="customEndpoint" className="text-sm font-medium">
                  Custom LLM Endpoint URL *
                </Label>
                <Input
                  id="customEndpoint"
                  placeholder="https://your-custom-llm-endpoint.com/api/v1"
                  value={customEndpoint}
                  onChange={(e) => {
                    setCustomEndpoint(e.target.value);
                    if (endpointError) setEndpointError('');
                  }}
                  className={endpointError ? 'border-red-500' : ''}
                  required
                />
                {endpointError && (
                  <p className="text-sm text-red-500">{endpointError}</p>
                )}
                <p className="text-xs text-gray-600">
                  Enter the API endpoint URL for your custom language model. Make sure it follows OpenAI-compatible API format.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Note about Model Selection</h4>
            <p className="text-sm text-yellow-700">
              The selected model will be used to evaluate OrionAI's responses against your configured metrics. 
              Different models may produce varying evaluation results based on their training and capabilities.
              {isConfidential && (
                <span className="block mt-2 font-medium">
                  For confidential test suites, only custom endpoints are allowed to ensure data privacy.
                </span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
          Start Test Execution <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModelSelection;
