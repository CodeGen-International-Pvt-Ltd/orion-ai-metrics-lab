
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Brain, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ModelSelectionProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
  testSuites: any[];
  selectedTestSuiteId: string | null;
  config: any;
  setConfig: (config: any) => void;
}

const ModelSelection = ({ selectedModel, setSelectedModel, onNext, onBack, testSuites, selectedTestSuiteId, config, setConfig }: ModelSelectionProps) => {
  const [customEndpoint, setCustomEndpoint] = useState(config.customEndpoint || '');
  const [endpointError, setEndpointError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const selectedTestSuite = testSuites.find(suite => suite.id === selectedTestSuiteId);
  const isConfidential = selectedTestSuite?.confidentialityStatus || false;

  const models = [
    {
      id: 'openai',
      name: 'OpenAI GPT-4',
      description: 'Advanced language model with excellent reasoning capabilities',
      features: ['High accuracy', 'Complex reasoning', 'Broad knowledge base'],
      recommended: true,
      disabled: isConfidential
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      description: 'Constitutional AI model focused on helpfulness and safety',
      features: ['Safety-focused', 'Nuanced responses', 'Ethical reasoning'],
      recommended: false,
      disabled: isConfidential
    },
    {
      id: 'custom',
      name: 'Custom LLM Endpoint',
      description: 'Connect to your own custom language model endpoint',
      features: ['Full control', 'Custom configuration', 'Private deployment'],
      recommended: false,
      disabled: false
    }
  ];

  const validateCustomEndpoint = () => {
    if (selectedModel === 'custom' && !customEndpoint.trim()) {
      setEndpointError('Custom LLM endpoint is required');
      return false;
    }
    
    if (selectedModel === 'custom') {
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

  const createOrUpdateConfiguration = async () => {
    const pendingConfig = config.pendingConfiguration;
    if (!pendingConfig) return;

    const allMetrics = [
      { id: 'correctness', name: 'Correctness' },
      { id: 'hallucination', name: 'Hallucination' },
      { id: 'answer relevancy', name: 'Answer Relevancy' },
      { id: 'contexual relevancy', name: 'Contextual Relevancy' },
      { id: 'summarization', name: 'Summarization' },
      { id: 'retrieving same/similar content', name: 'Retrieving Content' },
      { id: 'leading questions', name: 'Leading Questions' },
      { id: 'edge cases', name: 'Edge Cases' },
      { id: 'unnecessary context', name: 'Unnecessary Context' },
      { id: 'repetitive loops', name: 'Repetitive Loops' },
      { id: 'spam/flooding', name: 'Spam/Flooding' },
      { id: 'intentional misdirection', name: 'Intentional Misdirection' },
      { id: 'prompt overloading', name: 'Prompt Overloading' },
      { id: 'susceptibility to prompt tuning attacks', name: 'Susceptibility to Prompt Tuning Attacks' }
    ];

    const selectedMetrics = [];
    const selectedThresholds = []; 

    const groupedMetrics: Record<string, Record<string, number>> = {};

// Direct mapping of correct backend IDs
const metricCategoryMap: Record<string, string> = {
  'correctness': 'content evaluation',
  'hallucination': 'content evaluation',
  'answer relevancy': 'content evaluation',
  'contexual relevancy': 'content evaluation', // spelling matches backend!

  'summarization': 'retrieval and generation evaluation',
  'retrieving same/similar content': 'retrieval and generation evaluation',

  'leading questions': 'functional testing',
  'edge cases': 'functional testing',
  'unncessary context': 'functional testing', // spelling matches backend!

  'repetitive loops': 'non functional testing',
  'spam/flooding': 'non functional testing',
  'intentional misdirection': 'non functional testing',
  'prompt overloading': 'non functional testing',
  'susceptibility to prompt tuning attacks': 'non functional testing',
};

// These are the backend-supported keys (to avoid frontend typos)
const supportedBackendMetrics = Object.keys(metricCategoryMap);

// Build `groupedMetrics` object
['contentEvaluation', 'retrievalGeneration', 'functionalTesting', 'nonFunctionalTesting'].forEach(category => {
  const thresholds = pendingConfig.thresholds[category];
  if (!thresholds) return;

  Object.entries(thresholds).forEach(([metricId, metricData]: [string, any]) => {
    const metricKey = metricId.trim().toLowerCase();

    // Try to find the exact backend key from mapping
    const backendKey = supportedBackendMetrics.find(
      backendMetric => backendMetric === metricKey
    );

    if (backendKey) {
      const group = metricCategoryMap[backendKey];
      if (!groupedMetrics[group]) groupedMetrics[group] = {};
      groupedMetrics[group][backendKey] = metricData.threshold / 100;
    }
  });
});


    // Extract metrics and thresholds from the configuration
    ['contentEvaluation', 'retrievalGeneration', 'functionalTesting', 'nonFunctionalTesting'].forEach(category => {
      if (pendingConfig.thresholds[category]) {
        Object.entries(pendingConfig.thresholds[category]).forEach(([metricId, metricData]: [string, any]) => {
          const metricInfo = allMetrics.find(m => m.id === metricId);
          if (metricInfo) {
            selectedMetrics.push(metricInfo.name);
            selectedThresholds.push(metricData.threshold / 100);
          }
        });
      }
    });

    const requestBody = {
      suite_type: selectedTestSuite?.type || "excel",
      api_endpoint: "https://api.example.com/process",
      selected_metrics: groupedMetrics, // nested and grouped by backend categories
      selected_thresholds: [], // keep empty or remove if not needed
      directory: "C:/Users/krithigat/Downloads/ML-viva",
      excel_output_path: "C:/Users/krithigat/Downloads",
      model_selected: selectedModel === 'custom' ? 'custom' : selectedModel
    };
    
    
    
    const response = await fetch(`http://127.0.0.1:8000/test-suite/${pendingConfig.testSuiteId}/configurations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    console.log('Request body:', requestBody);
    
    if (!response.ok) {
      throw new Error('Failed to create configuration');
    }
    
    toast({
      title: "Configuration Created",
      description: "Your configuration has been created successfully with the selected model.",
    });
  }

  
  const handleNext = async () => {
    if (!validateCustomEndpoint()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Save configuration with selected model
      await createOrUpdateConfiguration();
      
      // Update config with selected model
      setConfig({
        ...config,
        selectedModel: selectedModel,
        customEndpoint: selectedModel === 'custom' ? customEndpoint : null
      });
      
      onNext();
    } catch (error) {
      console.error('Error processing model selection:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Auto-select Custom if confidential and no valid model selected
  if (isConfidential && (selectedModel === 'openai' || selectedModel === 'claude' || !selectedModel)) {
    setSelectedModel('custom');
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
            Choose the AI model that will generate modified questions—such as biased, noisy, ambiguous, or edge-case variants—based on your original Q&A pairs. These generated questions help evaluate the robustness of the OrionAI system
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
                  : `cursor-pointer border ${
                      selectedModel === model.id ? 'border-blue-500 ' : 'border-gray-200'
                    } hover:bg-gray-50/10`
                }`}>
                  <RadioGroupItem
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
          {selectedModel === 'custom' && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <div className="space-y-3">
                <Label htmlFor="customEndpoint" className="text-sm font-medium text-black dark:text-black">
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
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Start Test Execution'} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModelSelection;
