
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRight, Brain, BarChart3, FileText } from "lucide-react";
import TestSuiteCreation from '@/components/TestSuiteCreation';
import MetricsConfiguration from '@/components/MetricsConfiguration';
import ModelSelection from '@/components/ModelSelection';
import TestExecution from '@/components/TestExecution';
import ResultsDashboard from '@/components/ResultsDashboard';
import ReportGeneration from '@/components/ReportGeneration';
import DisplayTestSuites from '@/components/DisplayTestSuites';
import AppSidebar from '@/components/AppSidebar';
import TestRunsDisplay from '@/components/TestRunsDisplay';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentView, setCurrentView] = useState('workflow'); // 'workflow', 'displaySuites', or 'testRuns'
  // Set default user data as logged in
  const [userData, setUserData] = useState({ 
    name: 'John Doe', 
    email: 'john.doe@company.com' 
  });
  const [testSuites, setTestSuites] = useState([]);
  const [metricsConfig, setMetricsConfig] = useState({});
  const [selectedModel, setSelectedModel] = useState('OpenAI');
  const [evaluationResults, setEvaluationResults] = useState(null);
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState(null);
  const [selectedTestRunId, setSelectedTestRunId] = useState(null);
  // Track results per test suite with multiple test runs
  const [testSuiteResults, setTestSuiteResults] = useState({});

  const steps = [
    'Welcome',
    'Test Suites',
    'Configuration',
    'Model Selection',
    'Test Execution',
    'Results',
    'Report'
  ];

  const handleRegisterTestSuite = () => {
    setCurrentView('workflow');
    setCurrentStep(1); // Go to Test Suites page
  };

  const handleDisplayTestSuites = () => {
    setCurrentView('displaySuites');
  };

  const handleSelectTestSuite = (suiteId: string) => {
    console.log('Selected test suite:', suiteId);
    setSelectedTestSuiteId(suiteId);
    
    // Check if there are any test runs for this suite
    const suiteResults = testSuiteResults[suiteId];
    if (!suiteResults || !suiteResults.testRuns || suiteResults.testRuns.length === 0) {
      // No test runs, go directly to test execution
      setCurrentView('workflow');
      setCurrentStep(2); // Go to Configuration step
    } else {
      // Has test runs, show test runs page
      setCurrentView('testRuns');
    }
  };

  const handleSelectTestRun = (runId: string) => {
    console.log('Selected test run:', runId);
    setSelectedTestRunId(runId);
    
    // Find the specific test run results
    const suiteResults = testSuiteResults[selectedTestSuiteId];
    if (suiteResults && suiteResults.testRuns) {
      const testRun = suiteResults.testRuns.find(run => run.id === runId);
      if (testRun) {
        setEvaluationResults(testRun);
        setCurrentView('workflow');
        setCurrentStep(5); // Go to Results page
      }
    }
  };

  const handleBackToWorkflow = () => {
    setCurrentView('workflow');
  };

  const handleBackToTestSuites = () => {
    setCurrentView('displaySuites');
  };

  const getStepIcon = (stepIndex: number) => {
    const icons = [null, FileText, BarChart3, Brain, Brain, BarChart3, FileText];
    return icons[stepIndex];
  };

  const handleStepIconClick = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentView('workflow');
      setCurrentStep(stepIndex);
    }
  };

  const handleTestExecutionComplete = (results: any) => {
    // Store results for the selected test suite as a new test run
    if (selectedTestSuiteId) {
      const testRunId = `run_${Date.now()}`;
      const testRunResults = {
        ...results,
        id: testRunId,
        timestamp: new Date().toISOString()
      };

      setTestSuiteResults(prev => ({
        ...prev,
        [selectedTestSuiteId]: {
          ...prev[selectedTestSuiteId],
          testRuns: [
            ...(prev[selectedTestSuiteId]?.testRuns || []),
            testRunResults
          ]
        }
      }));
    }
    setEvaluationResults(results);
  };

  const getSelectedTestSuite = () => {
    return testSuites.find(suite => suite.id === selectedTestSuiteId);
  };

  const getTestRunsForSuite = () => {
    const suiteResults = testSuiteResults[selectedTestSuiteId];
    return suiteResults?.testRuns || [];
  };

  const renderCurrentStep = () => {
    if (currentView === 'displaySuites') {
      return (
        <DisplayTestSuites 
          testSuites={testSuites}
          testSuiteResults={testSuiteResults}
          onSelectTestSuite={handleSelectTestSuite}
          onBack={handleBackToWorkflow}
        />
      );
    }

    if (currentView === 'testRuns') {
      const selectedSuite = getSelectedTestSuite();
      const testRuns = getTestRunsForSuite();
      
      return (
        <TestRunsDisplay
          testSuiteName={selectedSuite?.name || 'Unknown Test Suite'}
          testRuns={testRuns}
          onSelectTestRun={handleSelectTestRun}
          onBack={handleBackToTestSuites}
        />
      );
    }

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
        return <TestSuiteCreation testSuites={testSuites} setTestSuites={setTestSuites} onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} setSelectedTestSuiteId={setSelectedTestSuiteId} />;
      case 2:
        return <MetricsConfiguration config={metricsConfig} setConfig={setMetricsConfig} testSuites={testSuites} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3:
        return <ModelSelection selectedModel={selectedModel} setSelectedModel={setSelectedModel} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} testSuites={testSuites} selectedTestSuiteId={selectedTestSuiteId} />;
      case 4:
        return <TestExecution onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} setResults={handleTestExecutionComplete} selectedTestSuiteId={selectedTestSuiteId} />;
      case 5:
        return <ResultsDashboard results={evaluationResults} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6:
        return <ReportGeneration results={evaluationResults} onBack={() => setCurrentStep(5)} />;
      default:
        return null;
    }
  };

  if (currentStep === 0) {
    return renderCurrentStep();
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          userData={userData}
          onRegisterTestSuite={handleRegisterTestSuite}
          onDisplayTestSuites={handleDisplayTestSuites}
        />
        
        <div className="flex-1 bg-gray-50">
          {/* Progress Header - only show for workflow */}
          {currentView === 'workflow' && (
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-6xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">AI Evaluator Platform</h1>
                  <div className="text-sm text-gray-600">
                    Step {currentStep} of {steps.length - 1}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {steps.slice(1).map((step, index) => {
                    const StepIcon = getStepIcon(index + 1);
                    return (
                      <div key={step} className="flex items-center">
                        <div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                            index + 1 < currentStep ? 'bg-blue-600 text-white hover:bg-blue-700' : 
                            index + 1 === currentStep ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 
                            'bg-gray-200 text-gray-600'
                          }`}
                          onClick={() => handleStepIconClick(index + 1)}
                        >
                          {StepIcon && <StepIcon className="w-4 h-4" />}
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
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-6 py-8">
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
