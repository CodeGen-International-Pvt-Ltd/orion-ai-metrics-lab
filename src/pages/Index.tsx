import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
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
import Dashboard from '@/components/Dashboard';
import LoginPage from '@/components/LoginPage';
import { ThemeToggle } from '@/components/ThemeToggle';
import ServerErrorPage from '@/components/ServerErrorPage';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentView, setCurrentView] = useState<'workflow' | 'displaySuites' | 'testRuns' | 'dashboard'>('workflow');
  const [testSuites, setTestSuites] = useState<any[]>([]);
  const [selectedTestSuiteId, setSelectedTestSuiteId] = useState<number | null>(null);
  const [metricsConfig, setMetricsConfig] = useState<any>({});
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [evaluationResults, setEvaluationResults] = useState<any>(null);
  const [testSuiteResults, setTestSuiteResults] = useState<Record<string, any>>({});
  const [userData, setUserData] = useState<{ id: number; name: string; email: string } | null>(null);

  const steps = ['', 'Create Test Suite', 'Configure Metrics', 'Select Model', 'Execute Tests', 'View Results', 'Generate Report'];

  const handleLogin = (loginData: { id: number; name: string; email: string }) => {
    setUserData(loginData);
    setCurrentStep(1);
  };

  const handleUpdateUser = (updatedUserData: { id: number; name: string; email: string }) => {
    setUserData(updatedUserData);
  };

  const handleUpdateTestSuite = (updatedTestSuite: any) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === updatedTestSuite.id ? updatedTestSuite : suite
    ));
  };

  const handleDeleteTestSuite = (suiteId: number) => {
    setTestSuites(prev => prev.filter(suite => suite.id !== suiteId));
    setTestSuiteResults(prev => {
      const newResults = { ...prev };
      delete newResults[suiteId];
      return newResults;
    });
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentStep(0);
    setCurrentView('workflow');
    setTestSuites([]);
    setSelectedTestSuiteId(null);
    setMetricsConfig({});
    setSelectedModel('');
    setEvaluationResults(null);
    setTestSuiteResults({});
  };

  const handleRegisterTestSuite = () => {
    setCurrentView('workflow');
    setCurrentStep(1);
  };

  const handleDisplayTestSuites = () => {
    setCurrentView('displaySuites');
  };

  const handleDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleSelectTestSuite = (suiteId: number) => {
    setSelectedTestSuiteId(suiteId);
    setCurrentView('testRuns');
  };

  const handleSelectTestRun = (runId: number) => {
    // Navigate to results view with the selected test run
    console.log('Selected test run:', runId);
    // For now, we'll just log it. You can implement the results view later
    alert(`Test Run ${runId} selected. Results view will be implemented.`);
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

  // Show login page if user is not logged in
  if (!userData) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <LoginPage onLogin={(loginData) => {
          setUserData(loginData);
          console.log("User logged in:", loginData);
          setCurrentStep(1);
        }} />
      </ThemeProvider>
    );
  }

  

  const renderCurrentStep = () => {
    if (currentView === 'dashboard') {
      return (
        <Dashboard 
          testSuites={testSuites}
          userData={userData}
          onSelectTestRun={handleSelectTestRun}
          onSelectTestSuite={handleSelectTestSuite}
          onUpdateTestSuite={handleUpdateTestSuite}
          onDeleteTestSuite={handleDeleteTestSuite}
        />
      );
    }

    if (currentView === 'displaySuites') {
      return (
        <DisplayTestSuites 
          testSuites={testSuites}
          testSuiteResults={testSuiteResults}
          onSelectTestSuite={handleSelectTestSuite}
          onUpdateTestSuite={handleUpdateTestSuite}
          onDeleteTestSuite={handleDeleteTestSuite}
          onBack={handleBackToWorkflow}
        />
      );
    }

    if (currentView === 'testRuns') {
      const selectedSuite = getSelectedTestSuite();
      
      return (
        <TestRunsDisplay
          testSuiteName={selectedSuite?.name || 'Unknown Test Suite'}
          testSuiteId={selectedTestSuiteId || 0}
          onSelectTestRun={handleSelectTestRun}
          onBack={handleBackToTestSuites}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return <TestSuiteCreation testSuites={testSuites} setTestSuites={setTestSuites} onNext={() => setCurrentStep(2)} onBack={() => setCurrentStep(0)} setSelectedTestSuiteId={setSelectedTestSuiteId} userId={userData?.id} />;
      case 2:
        return <MetricsConfiguration config={metricsConfig} setConfig={setMetricsConfig} testSuites={testSuites} onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} selectedTestSuiteId={selectedTestSuiteId} testSuiteResults={testSuiteResults} />;
      case 3:
        return <ModelSelection selectedModel={selectedModel} setSelectedModel={setSelectedModel} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} testSuites={testSuites} selectedTestSuiteId={selectedTestSuiteId} config={metricsConfig} setConfig={setMetricsConfig} />;
      case 4:
        return <TestExecution onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} setResults={handleTestExecutionComplete} selectedTestSuiteId={selectedTestSuiteId} />;
      case 5:
        // If results are null, show the server error page with sidebar and navigation
        if (!evaluationResults) {
          return (
            <div className="flex w-full min-h-screen">
              <AppSidebar 
                userData={userData}
                onRegisterTestSuite={handleRegisterTestSuite}
                onDisplayTestSuites={handleDisplayTestSuites}
                onLogout={handleLogout}
                onDashboard={handleDashboard}
                onUpdateUser={handleUpdateUser}
              />
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-background transition-colors duration-300">
                <div className="w-full">
                  {/* ServerErrorPage with no back button, just navigation/sidebar */}
                  <ServerErrorPage errorCode={500} title="Server Error" description="Failed to load test results. Please check your server connection and try again." showRefresh={true} onGoHome={() => setCurrentView('dashboard')}/>
                </div>
              </div>
            </div>
          );
        }
        return <ResultsDashboard results={evaluationResults} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6:
        return <ReportGeneration results={evaluationResults} onBack={() => setCurrentStep(5)} />;
      default:
        return null;
    }
  };

  if (currentStep === 0) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        {renderCurrentStep()}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar 
            userData={userData}
            onRegisterTestSuite={handleRegisterTestSuite}
            onDisplayTestSuites={handleDisplayTestSuites}
            onLogout={handleLogout}
            onDashboard={handleDashboard}
            onUpdateUser={handleUpdateUser}
          />
          
          <div className="flex-1 bg-gray-50 dark:bg-background transition-colors duration-300">
            {/* Progress Header - only show for workflow */}
            {currentView === 'workflow' && (
              <div className="bg-white dark:bg-card shadow-sm border-b border-gray-200 dark:border-border">
                <div className="max-w-6xl mx-auto px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">AI Evaluator Platform</h1>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600 dark:text-muted-foreground">
                        Step {currentStep} of {steps.length - 1}
                      </div>
                      <ThemeToggle />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {steps.slice(1).map((step, index) => {
                      const StepIcon = getStepIcon(index + 1);
                      return (
                        <div key={step} className="flex items-center">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-colors ${
                              index + 1 < currentStep ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600' : 
                              index + 1 === currentStep ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400' : 
                              'bg-gray-200 dark:bg-muted text-gray-600 dark:text-muted-foreground'
                            }`}
                            onClick={() => handleStepIconClick(index + 1)}
                          >
                            {StepIcon && <StepIcon className="w-4 h-4" />}
                          </div>
                          <div className={`ml-2 text-sm font-medium ${
                            index + 1 <= currentStep ? 'text-gray-800 dark:text-foreground' : 'text-gray-400 dark:text-muted-foreground'
                          }`}>
                            {step}
                          </div>
                          {index < steps.length - 2 && (
                            <div className={`w-8 h-0.5 mx-4 ${
                              index + 1 < currentStep ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-border'
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
    </ThemeProvider>
  );
};

export default Index;
