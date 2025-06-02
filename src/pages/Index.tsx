
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, BarChart3, FileText } from "lucide-react";
import UserProfile from '@/components/UserProfile';
import TestSuiteCreation from '@/components/TestSuiteCreation';
import MetricsConfiguration from '@/components/MetricsConfiguration';
import ModelSelection from '@/components/ModelSelection';
import TestExecution from '@/components/TestExecution';
import ResultsDashboard from '@/components/ResultsDashboard';
import ReportGeneration from '@/components/ReportGeneration';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [testSuites, setTestSuites] = useState([]);
  const [metricsConfig, setMetricsConfig] = useState({});
  const [selectedModel, setSelectedModel] = useState('OpenAI');
  const [evaluationResults, setEvaluationResults] = useState(null);

  const steps = [
    'Welcome',
    'User Profile',
    'Test Suites',
    'Configuration',
    'Model Selection',
    'Test Execution',
    'Results',
    'Report'
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold text-gray-900">AI Evaluator Platform</CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive evaluation framework for OrionAI performance testing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Advanced Metrics</h3>
                    <p className="text-sm text-gray-600">BLEU, ROUGE, METEOR, and more</p>
                  </div>
                  <div className="text-center p-4">
                    <Brain className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">AI Model Selection</h3>
                    <p className="text-sm text-gray-600">Choose your evaluation model</p>
                  </div>
                  <div className="text-center p-4">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Detailed Reports</h3>
                    <p className="text-sm text-gray-600">Comprehensive evaluation results</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setCurrentStep(1)} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Get Started <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 1:
        return <UserProfile userData={userData} setUserData={setUserData} onNext={() => setCurrentStep(2)} />;
      case 2:
        return <TestSuiteCreation testSuites={testSuites} setTestSuites={setTestSuites} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <MetricsConfiguration config={metricsConfig} setConfig={setMetricsConfig} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4:
        return <ModelSelection selectedModel={selectedModel} setSelectedModel={setSelectedModel} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5:
        return <TestExecution onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} setResults={setEvaluationResults} />;
      case 6:
        return <ResultsDashboard results={evaluationResults} onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
      case 7:
        return <ReportGeneration results={evaluationResults} onBack={() => setCurrentStep(6)} />;
      default:
        return null;
    }
  };

  if (currentStep === 0) {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">AI Evaluator Platform</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length - 1}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {steps.slice(1).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index + 1 < currentStep ? 'bg-blue-600 text-white' : 
                  index + 1 === currentStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 
                  'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step}
                </div>
                {index < steps.length - 2 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    index + 1 < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default Index;
