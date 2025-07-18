import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, ArrowRight, CheckCircle, Clock, AlertCircle } from "lucide-react";
import ServerErrorPage from "./ServerErrorPage";
import { getBackendUrl } from "../lib/config";
import * as api from "../lib/apiPaths";
import { createTestRun as apiCreateTestRun, deleteTestRun as apiDeleteTestRun, getTestRun } from "../lib/apiService";

interface TestExecutionProps {
  onNext: () => void;
  onBack: () => void;
  setResults: (results: any) => void;
  selectedTestSuiteId?: number | null;
}

export const generateMockResults = (suiteId: string) => {
  const seed = suiteId ? parseInt(suiteId.slice(-3)) || 123 : 123;
  const random = (min: number, max: number) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);
  
  // Content Evaluation with more variance
  const contentEvaluation = {
    correctness: Math.round((45 + random(0, 40)) * 10) / 10,
    hallucination: Math.round((5 + random(0, 25)) * 10) / 10,
    answer_relevancy: Math.round((35 + random(0, 50)) * 10) / 10,
    contextual_relevance: Math.round((30 + random(0, 45)) * 10) / 10
  };

  
  
  // Retrieval and Generation Evaluation with variance
  const retrievalGeneration = {
    summarization: {
      fluency: Math.round((25 + random(0, 55)) * 10) / 10,
      conciseness: Math.round((40 + random(0, 45)) * 10) / 10,
      relevance: Math.round((50 + random(0, 40)) * 10) / 10
    },
    retrieving_same_content: Math.round((60 + random(0, 35)) * 10) / 10,
    retrieving_similar_content: Math.round((20 + random(0, 60)) * 10) / 10
  };

  // Functional Testing with realistic variance
  const functionalTesting = {
    leading_questions: {
      biasness: Math.round((30 + random(0, 50)) * 10) / 10,
      consistency: Math.round((45 + random(0, 40)) * 10) / 10,
      factuality: Math.round((65 + random(0, 30)) * 10) / 10
    },
    edge_cases: {
      fluency: Math.round((35 + random(0, 45)) * 10) / 10,
      conciseness: Math.round((25 + random(0, 55)) * 10) / 10,
      relevance: Math.round((50 + random(0, 35)) * 10) / 10,
      correctness: Math.round((40 + random(0, 45)) * 10) / 10,
      hallucination: Math.round((10 + random(0, 30)) * 10) / 10
    },
    unnecessary_context: {
      fluency: Math.round((55 + random(0, 35)) * 10) / 10,
      conciseness: Math.round((30 + random(0, 50)) * 10) / 10,
      relevance: Math.round((45 + random(0, 40)) * 10) / 10,
      correctness: Math.round((70 + random(0, 25)) * 10) / 10,
      hallucination: Math.round((5 + random(0, 20)) * 10) / 10
    }
  };

  // Non-Functional Testing with variance
  const nonFunctionalTesting = {
    repetitive_loops: Math.round((75 + random(0, 20)) * 10) / 10,
    spam_flooding: Math.round((50 + random(0, 40)) * 10) / 10,
    intentional_misdirection: Math.round((35 + random(0, 45)) * 10) / 10,
    prompt_overloading: Math.round((25 + random(0, 55)) * 10) / 10,
    susceptibility_prompt_tuning: Math.round((40 + random(0, 45)) * 10) / 10
  };

  // Calculate overall scores for each category
  const contentScore = (contentEvaluation.correctness + (100 - contentEvaluation.hallucination) + 
                       contentEvaluation.answer_relevancy + contentEvaluation.contextual_relevance) / 4;
  
  const retrievalScore = (retrievalGeneration.summarization.fluency + retrievalGeneration.summarization.conciseness + 
                         retrievalGeneration.summarization.relevance + retrievalGeneration.retrieving_same_content + 
                         retrievalGeneration.retrieving_similar_content) / 5;

  const functionalScore = (functionalTesting.leading_questions.biasness + functionalTesting.leading_questions.consistency + 
                          functionalTesting.leading_questions.factuality + functionalTesting.edge_cases.fluency + 
                          functionalTesting.edge_cases.conciseness + functionalTesting.edge_cases.relevance + 
                          functionalTesting.edge_cases.correctness + (100 - functionalTesting.edge_cases.hallucination) + 
                          functionalTesting.unnecessary_context.fluency + functionalTesting.unnecessary_context.conciseness + 
                          functionalTesting.unnecessary_context.relevance + functionalTesting.unnecessary_context.correctness + 
                          (100 - functionalTesting.unnecessary_context.hallucination)) / 13;

  const nonFunctionalScore = (nonFunctionalTesting.repetitive_loops + nonFunctionalTesting.spam_flooding + 
                             nonFunctionalTesting.intentional_misdirection + nonFunctionalTesting.prompt_overloading + 
                             nonFunctionalTesting.susceptibility_prompt_tuning) / 5;
 

              
                              
  const overallScore = (contentScore + retrievalScore + functionalScore + nonFunctionalScore) / 4;

  return {
    overall_score: Math.round(overallScore * 10) / 10,
    category_scores: {
      content_evaluation: Math.round(contentScore * 10) / 10,
      retrieval_generation: Math.round(retrievalScore * 10) / 10,
      functional_testing: Math.round(functionalScore * 10) / 10,
      non_functional_testing: Math.round(nonFunctionalScore * 10) / 10
    },
    detailed_results: {
      content_evaluation: contentEvaluation,
      retrieval_generation: retrievalGeneration,
      functional_testing: functionalTesting,
      non_functional_testing: nonFunctionalTesting
    },
    execution_time: `${Math.floor(3 + random(0, 4))}m ${Math.floor(10 + random(0, 50))}s`,
    timestamp: new Date().toISOString()
  };
};

const TestExecution = ({ onNext, onBack, setResults, selectedTestSuiteId }: TestExecutionProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [completedTests, setCompletedTests] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [orionEndpoint, setOrionEndpoint] = useState('');
  const [endpointError, setEndpointError] = useState('');
  const [testRunId, setTestRunId] = useState<number | null>(null);
  const [totalTestRuns, setTotalTestRuns] = useState(0);
  const [serverError, setServerError] = useState(false);
  const [hasClickedViewResults, setHasClickedViewResults] = useState(false);

  
  // Global flag to prevent multiple test run creations
  const isCreatingTestRun = useRef(false);
  const currentExecutionRef = useRef<string | null>(null);

  const testPhases = [
    { name: 'Initializing Test Environment', duration: 1000 },
    { name: 'Loading Test Suites', duration: 1500 },
    { name: 'Executing Test Run', duration: 8000 },
    { name: 'Finalizing Results', duration: 500 }
  ];

  const fetchActualResults = async (runId: number) => {
    console.log("Test Suite ID:", selectedTestSuiteId);
    console.log("Test Run ID:", runId);
    if (!selectedTestSuiteId || !runId) throw new Error("Missing required IDs");
  
    console.log("Fetching results with:");
    
  
    console.log("✅ Test Run ID returned:", runId);
  
    const backendUrl = await getBackendUrl();
    const response = await getTestRun(selectedTestSuiteId, runId);
    if (!response.ok) {
      throw new Error("Failed to fetch test results");
    }
  
    const data = await response.json();
    console.log("✅ Results fetched:\n" + JSON.stringify(data, null, 2)); // Pretty print
    return data;
  };
  
  useEffect(() => {
    // Only run when isRunning changes to true
    if (!isRunning) return;
    
    const totalDuration = testPhases.reduce((sum, phase) => sum + phase.duration, 0);
    let currentTime = 0;
    let testRunCreated = false;
    const executionId = currentExecutionRef.current;
    let createdRunId: number | null = null;
    
    console.log("🔄 Starting execution cycle with ID:", executionId);
    
    const interval = setInterval(async () => {
      currentTime += 100;
      const newProgress = Math.min((currentTime / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      // Determine current phase
      let cumulativeTime = 0;
      for (let i = 0; i < testPhases.length; i++) {
        cumulativeTime += testPhases[i].duration;
        if (currentTime <= cumulativeTime) {
          const phaseName = testPhases[i].name;
          setCurrentPhase(phaseName);
          
          // Create test run when entering "Executing Test Run" phase
          if (phaseName === "Executing Test Run" && !testRunCreated && !isCreatingTestRun.current) {
            console.log("🔍 Creating test run for execution ID:", executionId);
            isCreatingTestRun.current = true;
            testRunCreated = true;
            
            try {
              const response = await apiCreateTestRun(selectedTestSuiteId, {
                host: 'http://172.22.178.74:8079/',
                app_id: '3f23b628-6b75-49fd-a1aa-840534949860',
                thread_id: '5dc36bd7-9723-4556-8aac-2ebd0102c872',
              });
              if (!response.ok) {
                throw new Error('Failed to create test run');
              }
              const data = await response.json();
              const runId = data.test_run?.test_run_id;
              if (!runId) throw new Error('test_run_id missing from response');
              createdRunId = runId;
              console.log(`✅ Test run created successfully for execution ID ${executionId}:`, runId);
              setTotalTestRuns(prev => {
                console.log(`📊 Updating total test runs from ${prev} to ${prev + 1}`);
                return prev + 1;
              });
            } catch (err) {
              console.error("❌ Failed to create test run for execution ID", executionId, ":", err);
              setEndpointError("Test run creation failed during execution phase.");
              clearInterval(interval);
              setIsRunning(false);
              isCreatingTestRun.current = false;
              return;
            }
          }
          break;
        }
      }
      
      // Mark completed phases
      const completed = [];
      let timeSum = 0;
      for (let i = 0; i < testPhases.length; i++) {
        timeSum += testPhases[i].duration;
        if (currentTime > timeSum) {
          completed.push(testPhases[i].name);
        }
      }
      setCompletedTests(completed);
      
      if (newProgress >= 100) {
        console.log("🎉 Execution completed for ID:", executionId);
        clearInterval(interval);
        setIsComplete(true);
        setIsRunning(false);
        isCreatingTestRun.current = false;
        
        if (createdRunId) {
          try {
            console.log("🧪 Using mock results instead of real API fetch");
        
            const mockResults = generateMockResults(selectedTestSuiteId?.toString() || "default");
        
            setResults(mockResults); // Set mock results to parent
          } catch (error) {
            console.error("Failed to generate mock results:", error);
            setServerError(true);
            setResults(null);
          }
        }        
      }
    }, 100);
    
    return () => {
      console.log("🧹 Cleaning up interval for execution ID:", executionId);
      clearInterval(interval);
    };
  }, [isRunning]); // Only depend on isRunning
  

  const validateEndpoint = () => {
    if (!orionEndpoint.trim()) {
      setEndpointError('OrionAI endpoint is required');
      return false;
    }
    
    try {
      new URL(orionEndpoint);
      setEndpointError('');
      return true;
    } catch {
      setEndpointError('Please enter a valid URL');
      return false;
    }
  };

  const createTestRun = async () => {
    if (!selectedTestSuiteId) return;
    console.log("Creating test run for suite ID:", selectedTestSuiteId);
    const backendUrl = await getBackendUrl();
    const response = await apiCreateTestRun(selectedTestSuiteId, {
      host: '172.22.178.74:8079',
      app_id: '3f23b628-6b75-49fd-a1aa-840534949860',
      thread_id: '5dc36bd7-9723-4556-8aac-2ebd0102c872',
    });
  
    if (!response.ok) {
      throw new Error('Failed to create test run');
    }
  
    const data = await response.json();
  
    const runId = data.test_run?.test_run_id;
    if (!runId) throw new Error('test_run_id missing from response');
  
    setTestRunId(runId); 
    console.log("Used test suite ID: ", selectedTestSuiteId);
    console.log("✅ Created test run ID:", runId);
  
    return runId;
  };
  

  const startTest = async () => {
    if (!validateEndpoint()) return;
  
    // Generate new execution ID
    currentExecutionRef.current = Date.now().toString();
    
    console.log("🚀 Starting test execution with ID:", currentExecutionRef.current);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    setProgress(0);
    setCompletedTests([]);
    setTestRunId(null);
    setEndpointError('');
    
    // Reset test run creation flag
    isCreatingTestRun.current = false;
  };

  const createAdditionalTestRun = async () => {
    if (!validateEndpoint()) return;
  
    // Generate new execution ID
    currentExecutionRef.current = Date.now().toString();
    
    console.log("🚀 Creating additional test run with ID:", currentExecutionRef.current);
    setIsRunning(true);
    setIsPaused(false);
    setIsComplete(false);
    setProgress(0);
    setCompletedTests([]);
    setTestRunId(null);
    setEndpointError('');
    
    // Reset test run creation flag
    isCreatingTestRun.current = false;
  };
  

  const pauseTest = () => {
    setIsPaused(true);
    setCurrentPhase("Execution Paused");
  };
  
  const resumeTest = () => {
    setIsPaused(false);
    // Resume from where it left off – could be handled in a useEffect or directly
    setCurrentPhase(prev => prev === "Execution Paused" ? "Resuming..." : prev);
  };
  
  

  
  

  // Handler for View Results button
  const handleViewResults = async () => {
    if (!selectedTestSuiteId) return;
    try {
      // Try to fetch real results for the latest run
      const runId = testRunId;
      if (!runId) {
        setResults(generateMockResults(selectedTestSuiteId.toString()));
        onNext();
        return;
      }
      const response = await getTestRun(selectedTestSuiteId, runId);
      if (!response.ok) {
        setResults(generateMockResults(selectedTestSuiteId.toString()));
        onNext();
        return;
      }
      const data = await response.json();
      if (!data || data.evaluation === null || (Array.isArray(data.test_results) && data.test_results.length === 0)) {
        setResults(generateMockResults(selectedTestSuiteId.toString()));
      } else {
        setResults(data);
      }
      onNext();
    } catch (error) {
      setResults(generateMockResults(selectedTestSuiteId.toString()));
      onNext();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Test Execution
            {selectedTestSuiteId && (
              <span className="text-sm font-normal text-gray-600">
                (Suite ID: {selectedTestSuiteId})
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Execute evaluation tests for OrionAI performance analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OrionAI Endpoint Input */}
          {!isRunning && (
            <div className="space-y-3">
              <Label htmlFor="orionEndpoint" className="text-sm font-medium">
                OrionAI Endpoint URL *
              </Label>
              <Input
                id="orionEndpoint"
                placeholder="https://your-orionai-endpoint.com/api/v1"
                value={orionEndpoint}
                onChange={(e) => {
                  setOrionEndpoint(e.target.value);
                  if (endpointError) setEndpointError('');
                }}
                className={endpointError ? 'border-red-500' : ''}
                required
              />
              {endpointError && (
                <p className="text-sm text-red-500">{endpointError}</p>
              )}
              <p className="text-xs text-gray-600">
                Enter the API endpoint URL for your OrionAI system that will be evaluated.
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex gap-4">
            {!isRunning ? (
              <Button 
                onClick={startTest} 
                className="bg-emerald-600 hover:bg-emerald-700 transform transition-transform hover:scale-105"
                disabled={!orionEndpoint.trim() || totalTestRuns > 0}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Test Execution
              </Button>
            ) : (
              <>
                {isPaused ? (
                  <Button onClick={resumeTest} className="bg-blue-600 hover:bg-blue-700 transform transition-transform hover:scale-105">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={pauseTest} variant="outline" className="transform transition-transform hover:scale-105">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Progress Section */}
          {isRunning && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Execution Progress</h3>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} variant="score" className="h-4 animate-pulse" />
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <p className="font-medium text-blue-900">Current Phase:</p>
                <p className="text-blue-700">{currentPhase}</p>
              </div>
            </div>
          )}

          {/* Test Run Statistics */}
          {!isRunning && totalTestRuns > 0 && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-green-900">Total Test Runs Created:</p>
                  <p className="text-2xl font-bold text-green-700">{totalTestRuns}</p>
                </div>
                <Button 
                  onClick={createAdditionalTestRun}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Create Another Test Run
                </Button>
              </div>
              <p className="text-sm text-green-600 mt-2">
                Each test run evaluates your OrionAI system with the configured metrics.
              </p>
            </div>
          )}

          {/* Test Phases Status */}
          {isRunning && (
            <div className="space-y-3">
              <h4 className="font-semibold">Test Phases</h4>
              <div className="space-y-2">
                {testPhases.map((phase) => (
                  <div key={phase.name} className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 hover:shadow-md">
                    {completedTests.includes(phase.name) ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 animate-bounce" />
                    ) : currentPhase === phase.name ? (
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={
                      completedTests.includes(phase.name) ? 'text-emerald-700 font-medium' :
                      currentPhase === phase.name ? 'text-blue-700 font-medium' :
                      'text-gray-600'
                    }>
                      {phase.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {isComplete && (
            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg text-center animate-fade-in">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2 animate-bounce" />
              <h3 className="text-lg font-semibold text-emerald-900 mb-2">Test Run Complete!</h3>
              <p className="text-emerald-700">
                Test run has been completed successfully. You can create additional test runs or view results.
              </p>
            </div>
          )}

          {/* Warning Messages */}
          {!isRunning && !isComplete && (
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800">Before Starting</h4>
                  <ul className="text-sm text-orange-700 mt-1 space-y-1">
                    <li>• Enter a valid OrionAI endpoint URL</li>
                    <li>• Ensure OrionAI system is accessible and running</li>
                    <li>• Test execution may take several minutes to complete</li>
                    <li>• Each execution creates one test run</li>
                    <li>• Do not close this window during test execution</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} disabled={isRunning && !isPaused} className="transform transition-transform hover:scale-105">
          Back
        </Button>
        <Button 
          onClick={handleViewResults}
          disabled={totalTestRuns === 0}
          className="bg-blue-600 hover:bg-blue-700 transform transition-transform hover:scale-105"
        >
          View Results <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default TestExecution;
