
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Brain, BarChart3, FileText, CheckCircle2 } from "lucide-react";
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
    { id: 'welcome', label: 'Welcome', icon: Brain },
    { id: 'profile', label: 'User Profile', icon: Brain },
    { id: 'test-suites', label: 'Test Suites', icon: FileText },
    { id: 'configuration', label: 'Configuration', icon: BarChart3 },
    { id: 'model-selection', label: 'Model Selection', icon: Brain },
    { id: 'execution', label: 'Test Execution', icon: Brain },
    { id: 'results', label: 'Results', icon: BarChart3 },
    { id: 'report', label: 'Report', icon: FileText }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl">
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8 pt-12">
                  <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                    OrionAI Evaluation Platform
                  </CardTitle>
                  <CardDescription className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Enterprise-grade AI performance evaluation with comprehensive metrics, advanced analytics, and detailed reporting capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-12 pb-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <div className="w-14 h-14 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center">
                        <BarChart3 className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Advanced Metrics</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">Comprehensive evaluation using BLEU, ROUGE, METEOR, BERTScore, and custom metrics</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200">
                      <div className="w-14 h-14 mx-auto mb-4 bg-indigo-600 rounded-xl flex items-center justify-center">
                        <Brain className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Multi-Model Support</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">Evaluate multiple AI models with flexible configuration and comparison tools</p>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                      <div className="w-14 h-14 mx-auto mb-4 bg-purple-600 rounded-xl flex items-center justify-center">
                        <FileText className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg text-slate-900 mb-2">Enterprise Reporting</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">Generate detailed reports with visualizations and actionable insights</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setCurrentStep(1)} 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    Begin Evaluation Setup <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 1:
        return <UserProfile userData={userData} setUserData={setUserData} onNext={() => setCurrentStep(2)} />;
      case 2:
        return <TestSuiteCreation testSuites={testSuites} setTestSuites={setTestSuites} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <MetricsConfiguration config={metricsConfig} setConfig={setMetricsConfig} testSuites={testSuites} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">OrionAI Evaluation Platform</h1>
                <p className="text-sm text-slate-600">Enterprise AI Performance Testing</p>
              </div>
            </div>
            <div className="text-sm text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
              {steps[currentStep]?.label}
            </div>
          </div>
          
          {/* Professional Progress Navigation */}
          <div className="relative">
            <div className="flex items-center justify-between">
              {steps.slice(1).map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = stepNumber < currentStep;
                const isCurrent = stepNumber === currentStep;
                const isUpcoming = stepNumber > currentStep;
                
                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isCompleted ? 'bg-green-500 text-white shadow-lg' : 
                        isCurrent ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-200' : 
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <step.icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className={`mt-3 text-center transition-all duration-300 ${
                        isCompleted || isCurrent ? 'text-slate-900 font-medium' : 'text-slate-500'
                      }`}>
                        <div className="text-sm font-medium">{step.label}</div>
                      </div>
                    </div>
                    {index < steps.length - 2 && (
                      <div className={`flex-1 h-0.5 mx-6 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default Index;
