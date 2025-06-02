
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight } from "lucide-react";

interface ModelSelectionProps {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const ModelSelection = ({ selectedModel, setSelectedModel, onNext, onBack }: ModelSelectionProps) => {
  const models = [
    {
      id: 'OpenAI',
      name: 'OpenAI GPT-4',
      description: 'Advanced language model with excellent reasoning capabilities',
      features: ['High accuracy', 'Complex reasoning', 'Broad knowledge base'],
      recommended: true
    },
    {
      id: 'Claude',
      name: 'Anthropic Claude',
      description: 'Constitutional AI model focused on helpfulness and safety',
      features: ['Safety-focused', 'Nuanced responses', 'Ethical reasoning'],
      recommended: false
    },
    {
      id: 'Gemini',
      name: 'Google Gemini',
      description: 'Multimodal AI model with strong analytical capabilities',
      features: ['Multimodal input', 'Fast processing', 'Code understanding'],
      recommended: false
    },
    {
      id: 'PaLM',
      name: 'Google PaLM 2',
      description: 'Large language model optimized for various tasks',
      features: ['Efficient processing', 'Task versatility', 'Good performance'],
      recommended: false
    }
  ];

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
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedModel} onValueChange={setSelectedModel} className="space-y-4">
            {models.map((model) => (
              <div key={model.id} className="relative">
                <div className={`flex items-center space-x-4 p-6 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <RadioGroupItem value={model.id} id={model.id} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Label htmlFor={model.id} className="text-lg font-semibold cursor-pointer">
                        {model.name}
                      </Label>
                      {model.recommended && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                          Recommended
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

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Note about Model Selection</h4>
            <p className="text-sm text-yellow-700">
              The selected model will be used to evaluate OrionAI's responses against your configured metrics. 
              Different models may produce varying evaluation results based on their training and capabilities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          Start Test Execution <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ModelSelection;
